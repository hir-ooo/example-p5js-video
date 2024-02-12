import p5 from 'p5';
import {
	ColorController,
	HiroApp,
	HiroAppOptions,
	NumberController,
	TextController,
} from '@hiro-sdk/core';

// This example is based on the medium article by Keno Leon "Making 2D art in Javascript !"
// https://k3no.medium.com/making-2d-art-in-javascript-5baa1506da22


const options: HiroAppOptions = {
    	title: 'P5js Ex 2',
    	author: '#f57e56',
    	description: 'Some description or instructions about your artwork.',
};

const app = new HiroApp(options);
app.bootstrap();

const bgColor = new ColorController('#2908fa', 'color-NjcUr',{
	label: 'BG Color'
});

const lineColors = new ColorController('#ff00a6', 'color-NjcUr', {
	label: 'Line Color'
});

const textController = new TextController('Unleash Your Creativity!','short-text-ZgZSt' ,{
	label: 'Text',
	onChange: (text: string) => {
		document.getElementById('some-text')!.innerHTML = text;
	},
});

const lineSpace = new NumberController(10,'slider-Gw2hv', {
	label: 'Line space',
	max: 100,
	min: 1,
	step: 1,
	slider: true,
});

const linesWeight = new NumberController(2,'slider-Gw2hv', {
	label: 'Line Weight',
	max: 10,
	min: 1,
	step: 0.5,
	slider: true,
});

const noiseScale = new NumberController(0.4,'slider-Gw2hv', {
	label: 'Noise Scale',
	max: 1,
	min: 0.1,
	step: 0.1,
	slider: true,
});

const noiseStrength = new NumberController(30, "perlin-noise-s", {
	label: "Noise Strength",
	max: 100,
	min: 1,
	step: 1,
	slider: true,
});

let sketch = (p) => {
	let canvas;
	let video;

	const w = p.windowWidth;
	const h = p.windowHeight;

	p.setup = () => {
		canvas = p.createCanvas(w, h);
		p.background(0);

		// Create the video capture
		video = p.createCapture(p.VIDEO);
		video.size(w, h);
		video.hide();

		p.frameRate(24);
	};

	p.draw = () => {
		p.background(bgColor.getValue());

		video.loadPixels();

		for (let i = 0; i < p.windowHeight/lineSpace.getValue(); i++) {
			const y = i * lineSpace.getValue(); // Calculate the y position of the line
			const yOffset = p.noise(i * noiseScale.getValue()) * noiseStrength.getValue();

			const startX = 0;
			const endX = w;

			p.noFill();
			p.strokeWeight(linesWeight.getValue());
			p.stroke(lineColors.getValue());

			p.beginShape();
			for (let x = startX; x <= endX; x++) {
				if (video.pixels.length > 0) {
					const index = (x + y * video.width) * 4; // Calculate the index for the pixels array
					const pixelColor = video.pixels[index]; // Use the red channel value of the pixel
					const height = y + (pixelColor / 255) * noiseStrength.getValue() - yOffset;
					// Map the pixel value to the line's height
					p.vertex(x, height);
				}
			}
			p.endShape();
		}
	};
};

new p5(sketch);
