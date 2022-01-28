let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let blockSize = 150;
let radius = 150;

function roundedRect(ctx, x, y, width, height, radius, color, isFill, isDash) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.moveTo(x, y + radius);
	ctx.arcTo(x, y + height, x + radius, y + height, radius);
	ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
	ctx.arcTo(x + width, y, x + width - radius, y, radius);
	ctx.arcTo(x, y, x, y + radius, radius);
	if(isFill) {
		ctx.fillStyle = color;
		ctx.fill();
	}
	ctx.strokeStyle = color;
	if(isDash) {
		ctx.setLineDash([5]);
		ctx.lineDashOffset = 5;
	}
	else {
		ctx.setLineDash([]);
	}
	ctx.stroke();
}

roundedRect(ctx, 0, 0, width, height, radius - 35, "#333", true, false);
roundedRect(ctx, 75, 75, width - 150, height - 150, radius - 50, "#fff", false, true);
roundedRect(ctx, 150, 150, width - 300, height - 300, radius - 65, "#c5dd73", true, false);

let winners = 0;

let Car = function(x, y, speed, driver, link, restrictions, offsetFactor, lapDataCar, carDriverField){
	this.x = x;
	this.y = y;
	this.draw(link);
	this.driver = driver;
	$(carDriverField).append(`Driver: ${this.driver}`);
	this.isRightDirection = true;
	this.isDownDirection = false;
	this.isLeftDirection = false;
	this.isUpDirection = false;
	this.lapDataCar = lapDataCar;
	this.move(speed, restrictions, offsetFactor);
}
Car.prototype.draw = function(link){
	let carHTML = `<img src=${link}>`;
	this.carElement = $(carHTML);
	this.carElement.css({
		position: "absolute",
		left: this.x,
		top: this.y,
		transform: 'rotate(0deg)',
		transition: `.2s`,
		transformOrigin: '100% 50%' 
	});
	$(".content").append(this.carElement);
};
Car.prototype.move = function(speed, restrictions, offsetFactor) {
	let self = this;
	let orientation = 0, turns = 1;
	let intervalId = setInterval(function(){
		if (self.x === 400 && turns === 4) {
			++winners;
		}
		if (self.x === 500 && turns === 4) {
			winners === 1 ? $(".winnerFirst").text(`FIRST: ${self.driver}!`) : $(".winnerSecond").text(`Second: ${self.driver}!`);
			clearInterval(intervalId);
		}
		if (self.x === 400 && self.y < 150) {
			turns < 4 && $(self.lapDataCar).text(`Lap: ${turns}/3`);
		}
		if(self.isRightDirection && self.x < 840 - restrictions) {
			isUpDirection = false;
			if(self.x > 835 - (restrictions * (offsetFactor * offsetFactor * offsetFactor))) {
				self.moveDown();
				++orientation;
				self.carElement.css({transform: `rotate(${orientation}deg)`});
				if (orientation % 90 === 0) {
					self.isDownDirection = true;
					self.isRightDirection = false;
				}
			}
			self.moveRight();
		}
		else if(self.isDownDirection && self.y < 575 - restrictions) {
			if (self.y > 570 - (restrictions * (offsetFactor * offsetFactor * offsetFactor))) {
				self.moveLeft();
				++orientation;
				self.carElement.css({transform: `rotate(${orientation}deg)`});
				if (orientation % 90 === 0) {
					self.isLeftDirection = true;
					self.isDownDirection = false;
				}
			}				
			self.moveDown();
		}
		else if(self.isLeftDirection && self.x > -80 + restrictions) {
			if (self.x < -75 + (restrictions * (offsetFactor * offsetFactor * offsetFactor))) {
				self.moveUp();
				++orientation;
				self.carElement.css({transform: `rotate(${orientation}deg)`});
				if (orientation % 90 === 0) {
					self.isUpDirection = true;
					self.isLeftDirection = false;
				}
			}
			self.moveLeft();
		}
		else if(self.isUpDirection && self.y > -45 + restrictions) {
			if (self.y < -40 + (restrictions * (offsetFactor * offsetFactor * offsetFactor))) {
				self.moveRight();
				++orientation;
				self.carElement.css({transform: `rotate(${orientation}deg)`});
				if (orientation % 90 === 0) {
					turns++;
					self.isRightDirection = true;
					self.isUpDirection = false;
				}
			}
			self.moveUp();
		}
	}, speed);
}
Car.prototype.moveRight = function(){
	let self = this;
	self.x += 1;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
Car.prototype.moveLeft = function(){
	let self = this;
	self.x -= 1;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
Car.prototype.moveDown = function(){
	let self = this;
	self.y += 1;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
Car.prototype.moveUp = function(){
	let self = this;
	self.y -= 1;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};

function getRandomSpeed(min, max) {
  return Math.random() * (max - min) + min;
}

let car1 = new Car(400, 7, getRandomSpeed(1, 18), "Dominic", "./icons/car1.png", 50, 1.4, ".statisticsFirstCar_lapData", ".statisticsFirstCar_driver");
let car2 = new Car(400, 80, getRandomSpeed(3, 20), "Brian", "./icons/car2.png", 120, 1.2, ".statisticsSecondCar_lapData", ".statisticsSecondCar_driver");