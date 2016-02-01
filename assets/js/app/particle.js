const drawCircle = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, radius), 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}  

function Particle(x,y,r){
    const pos = {
        x,
        y
    };
    let targetx = x;
    let targety = y;
    let targetr = r;
    let radiusOrig = r;
  
    const velMultiplier = 100;
    const vx = (Math.random() * .05 + .025) * velMultiplier; // px/s 
    const vy = (Math.random() * .05 + .025) * velMultiplier; // px/s
    const vr = (Math.random() * .05 + .025) * velMultiplier; // px/s

    let isDrifting = false;
    const z = r;

    let driftDirx = (Math.random() - .5) * -r;
    let driftDiry = (Math.random() - .5) * -r;
    let driftDirr = Math.random() * .1;

    const alpha = 1;
    const color = `rgb(255,255,255)`;
  
    let lastUpdateTime = 0;

    const getPos = () => Object.assign({}, pos, dimensions);

    const changeTarget = (newTargetx, newTargety, newTargetr) => {
        targetx = newTargetx;
        targety = newTargety;
        targetr = newTargetr;
    }

    const toggleDrifting = () => {
        isDrifting = !isDrifting;
    }

    const update = (t, target, cw, ch) => {
        const time = (t - lastUpdateTime) / 1000 // in secs
        const distx = time * vx;
        const disty = time * vy;
        const distr = time * vr;

        // Move to new targets
        let newx = x + distx * (targetx - x);
        let newy = y + disty * (targety - y);
        let newr = r + distr * (targetr - r);

        if(isDrifting) {
            newx = x + driftDirx;
            newy = y + driftDiry;
            newr = r + driftDirr;

            const mouseDifx = target.x - (cw / 2);
            const mouseDify = target.y - (ch / 2);

            newx -= (mouseDifx * z) * .0005
            newy -= (mouseDify * z) * .0005

            // Make sure radius stays within range
            if(newr <= 0 || newr >= radiusOrig) {
                newr = Math.min(radiusOrig, Math.max(0, newr));
                driftDirr *= -1;
            }
        }

        // MUTATIONS
        x = newx;
        y = newy;
        r = newr;
        lastUpdateTime = t;
    }
    
    const render = ctx => drawCircle(ctx, x, y, r, color); 

    return {
        getPos: Object.assign({}, pos),
        changeTarget,
        toggleDrifting,
        update,
        render,
    }
}

export default Particle;