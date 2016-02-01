const drawCircle = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}  

function Particle(x,y,r,colors = [0,0,0]){
    const pos = {
        x,
        y
    };
    let targetx = x;
    let targety = y;
  
    const vx = Math.random() * .05 + .025; // px/s 
    const vy = Math.random() * .05 + .025; // px/s

    let isFast = true;
    let isDrifting = false;
    const fastMultiplier = 100;
    const radiusOrig = r;
    let radius = r;
    const z = r;
    let maxMouseDistance = 100;

    let driftDirX = (Math.random() - .5) * -r;
    let driftDirY = (Math.random() - .5) * -r;

    const alpha = 1;
    const color = `rgba(${colors[0]},${colors[1]},${colors[2]},${alpha})`;
  
    let lastUpdateTime = 0;

    const getPos = () => Object.assign({}, pos, dimensions);

    const changeTarget = (newTargetx, newTargety, newIsFast = true) => {
        targetx = newTargetx;
        targety = newTargety;
        isFast = newIsFast;
    }

    const toggleDrifting = () => {
        isDrifting = !isDrifting;
    }

    const update = (t, target, cw, ch) => {
        const time = (t - lastUpdateTime) / 1000 // in secs
        const distx = time * (vx * (isFast ? fastMultiplier : 1));
        const disty = time * (vy * (isFast ? fastMultiplier : 1));
        let newx;
        let newy;

        if(!isDrifting) {
            newx = x + distx * (targetx - x);
            newy = y + disty * (targety - y);

        } else {
            newx = x + driftDirX;
            newy = y + driftDirY;

            const mouseDifx = target.x - (cw / 2);
            const mouseDify = target.y - (ch / 2);

            newx -= (mouseDifx * z) * .0005
            newy -= (mouseDify * z) * .0005
        }

        // MUTATIONS
        x = newx;
        y = newy;
        lastUpdateTime = t;
    }
    
    const render = ctx => drawCircle(ctx, x, y, radius, color); 

    return {
        getPos: Object.assign({}, pos),
        changeTarget,
        toggleDrifting,
        update,
        render,
    }
}

export default Particle;