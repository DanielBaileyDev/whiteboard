class Whiteboard {
    #canvas;
    #ctx;
    constructor(width, height) {
        this.#canvas = document.getElementById('whiteboard');
        this.#ctx = this.#canvas.getContext('2d');
        this.#canvas.width = width;
        this.#canvas.height = height;

        this.isDrawing = false;
        this.prevMouseLocation = [];
        this.tool = '';
    }

    get canvas(){
        return this.#canvas;
    }

    canDraw(mouse) {
        let current = [mouse.offsetX, mouse.offsetY];
        if (this.isDrawing) {
            this.prevMouseLocation = this.draw(this.prevMouseLocation, current);
            return true;
        }
        return false;
    }

    // Draws circles from previous mouse location to current mouse location to prevent skipping
    // fix problem: skipping when going from canvas to body
    draw(prev, current) {
        this.#ctx.save();
        this.#ctx.beginPath();
        if (prev.length > 0) {
            let differenceX = prev[0] - current[0];
            let differenceY = prev[1] - current[1];
            let xMultiplier = 1;
            let yMultiplier = 1;

            if (differenceX < 0) {
                xMultiplier = -1;
            }
            if (differenceY < 0) {
                yMultiplier = -1;
            }

            differenceX = Math.abs(differenceX);
            differenceY = Math.abs(differenceY);

            if (differenceX >= differenceY) {
                let ratio = differenceY / differenceX;
                for (let i = 0; i <= differenceX; i++) {
                    this.#ctx.arc(current[0] + i * xMultiplier, current[1] + i * yMultiplier * ratio, 5, 0, Math.PI * 2, true);
                }
            } else {
                let ratio = differenceX / differenceY;
                for (let i = 0; i <= differenceY; i++) {
                    this.#ctx.arc(current[0] + i * xMultiplier * ratio, current[1] + i * yMultiplier, 5, 0, Math.PI * 2, true);
                }
            }
        } else {
            this.#ctx.arc(current[0], current[1], 5, 0, Math.PI * 2, true);
        }

        this.useTool();

        return [current[0], current[1]];
    }

    useTool() {
        if (this.tool === 'pencil') {
            this.#ctx.fill();
        } else if (this.tool === 'eraser') {
            this.#ctx.clip();
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.#ctx.restore();
        }
    }

    mouseOn(mouse) {
        this.isDrawing = true;
        if (mouse.srcElement.id === 'whiteboard') {
            this.canDraw(mouse);
            return true;
        }
        return false;
    }

    mouseOff() {
        this.isDrawing = false;
        this.prevMouseLocation = [];
    }
}