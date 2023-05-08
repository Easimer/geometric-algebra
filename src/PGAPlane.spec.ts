import { Vector3 } from "three";
import { assert } from "chai";
import { PGAPoint } from "./PGAPoint";
import { PGALine } from "./PGALine";
import { PGAPlane } from "./PGAPlane";

describe('PGAPlane', () => {
    it('build plane from line and point', () => {
        const p0 = PGAPoint.fromVec3(new Vector3(0, 0, 1));
        const p1 = PGAPoint.fromVec3(new Vector3(1, 0, 1));
        const p2 = PGAPoint.fromVec3(new Vector3(1, 0, 0));
        const p3 = PGAPoint.fromVec3(new Vector3(0, 1, 0));
        const l0 = PGALine.fromTwoPoints(p0, p1);
        const plane = PGAPlane.fromLineAndPoint(l0, p2);
        const distances = plane.distancesFromPoints([p0, p1, p2, p3]);
        assert.approximately(distances[0], 0, 0.1);
        assert.approximately(distances[1], 0, 0.1);
        assert.approximately(distances[2], 0, 0.1);
        assert.approximately(distances[3], 1, 0.1);
    });
    it('build plane with perpendicularToLineContainsPoint', () => {
        const p0 = PGAPoint.fromVec3(new Vector3(0, 0, 0));
        const p1 = PGAPoint.fromVec3(new Vector3(0, 1, 0));
        const l0 = PGALine.fromTwoPoints(p0, p1);
        const p2 = PGAPoint.fromCoords(1, 1, 1, 1);
        const plane = PGAPlane.perpendicularToLineContainsPoint(l0, p2);
        const distances = plane.distancesFromPoints([p0, p1, p2]);
        assert.approximately(distances[0], 1, 0.1);
        assert.approximately(distances[1], 0, 0.1);
        assert.approximately(distances[2], 0, 0.1);
    });
});