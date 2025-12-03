export default class Camera {
    constructor(canvasWidth, player) {
        this.canvasWidth = canvasWidth;
        this.player = player;

        this.backgroundTransform = 0;
        this.MOVE_BG_L = false;
        this.MOVE_BG_R = false;
    }

    update() {
        const p = this.player;

        const isInScrollZone =
            p.WALK_X > p.MID && p.WALK_X < p.RANGE_MID;

        const isWalking = p.CURRENT_DIR === p.FACING_LEFT ||
                          p.CURRENT_DIR === p.FACING_RIGHT;

        if (isWalking && isInScrollZone) {
            this.MOVE_BG_L = (p.CURRENT_DIR === p.FACING_LEFT);
            this.MOVE_BG_R = (p.CURRENT_DIR === p.FACING_RIGHT);
        } else {
            this.MOVE_BG_L = false;
            this.MOVE_BG_R = false;
        }

        if (this.MOVE_BG_L) this.backgroundTransform += 5;
        if (this.MOVE_BG_R) this.backgroundTransform -= 5;
    }

    getDrawPosition() {
        const p = this.player;

        let cameraOffset = 0;

        if (p.WALK_X > p.MID && p.WALK_X < p.RANGE_MID) {
            cameraOffset = p.WALK_X - p.MID;
            return { x: p.MID, offset: cameraOffset };
        }

        if (p.WALK_X >= p.RANGE_MID) {
            cameraOffset = p.WALK_RANGE - this.canvasWidth;
            return {
                x: this.canvasWidth - (p.WALK_RANGE - p.WALK_X) - 10,
                offset: cameraOffset
            };
        }

        return { x: p.WALK_X, offset: 0 };
    }
}
