import { assert } from "chai";
import { PGAPoint } from "./PGAPoint";
import { PGAMotor } from "./PGAMotor";
import { Vector3 } from "three";

function assertEqAprox(actual: PGAPoint, expected: PGAPoint) {
    const [p, q] = [actual, expected];
    const dist = Math.sqrt(Math.pow(q.x * p.w - p.x * q.w, 2) + Math.pow(q.y * p.w - p.y * q.w, 2) + Math.pow(q.z * p.w - p.z * q.w, 2)) / Math.abs(actual.w * expected.w);
    assert.approximately(dist, 0, 0.1);
}

function assertMotorEqApprox<T extends object>(actual: T, expected: T) {
    const [p, q] = [actual, expected];
    for (const key of Object.keys(p) as Array<keyof T>) {
        // @ts-expect-error
        assert.approximately(p[key], q[key], 0.1);
    }
}

describe('PGAMotor', () => {
    it('translation', () => {
        const p0 = PGAPoint.fromCoords(1, 0, 0, 1);
        const T00 = PGAMotor.fromTranslation(new Vector3(1, 0, 0));
        const T01 = PGAMotor.fromTranslation(new Vector3(0, 1, 0));
        const T02 = PGAMotor.fromTranslation(new Vector3(0, 0, 1));
        const T10 = PGAMotor.fromTranslation(new Vector3(-1, 0, 0));
        const T11 = PGAMotor.fromTranslation(new Vector3(0, -1, 0));
        const T12 = PGAMotor.fromTranslation(new Vector3(0, 0, -1));
        assertEqAprox(T00.applyToPoint(p0), PGAPoint.fromCoords(2, 0, 0, 1));
        assertEqAprox(T01.applyToPoint(p0), PGAPoint.fromCoords(1, 1, 0, 1));
        assertEqAprox(T02.applyToPoint(p0), PGAPoint.fromCoords(1, 0, 1, 1));
        assertEqAprox(T10.applyToPoint(p0), PGAPoint.fromCoords(0, 0, 0, 1));
        assertEqAprox(T11.applyToPoint(p0), PGAPoint.fromCoords(1, -1, 0, 1));
        assertEqAprox(T12.applyToPoint(p0), PGAPoint.fromCoords(1, 0, -1, 1));
    });
    it('rotation', () => {
        const p0 = PGAPoint.fromCoords(1, 0, 0, 1);
        const T0 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI / 2);
        assertEqAprox(T0.applyToPoint(p0), PGAPoint.fromCoords(0, 1, 0, 1));
        const T1 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI);
        assertEqAprox(T1.applyToPoint(p0), PGAPoint.fromCoords(-1, 0, 0, 1));
    });
    it('translation invert', () => {
        const t0 = PGAMotor.fromTranslation(new Vector3(10, -10, 5));
        const t1 = PGAMotor.fromTranslation(new Vector3(-10, 10, -5));
        const t2 = t1.geometricAntiproductWithMotor(t0);
        const t3 = t0.geometricAntiproductWithMotor(t1);
        assertMotorEqApprox(t2, t3);
    });
    it('rotation invert', () => {
        const t0 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI / 2);
        const t1 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), -Math.PI / 2);
        const t2 = t1.geometricAntiproductWithMotor(t0);
        const t3 = t0.geometricAntiproductWithMotor(t1);
        assertMotorEqApprox(t2, t3);
    });
    it('translate x', () => {
        const p0 = PGAPoint.fromCoords(1, 1, 1, 1);
        const t0 = PGAMotor.fromTranslation(new Vector3(+10, 0, 0));
        const t1 = PGAMotor.fromTranslation(new Vector3(-10, 0, 0));

        assertEqAprox(t0.applyToPoint(p0), PGAPoint.fromCoords(+11, 1, 1, 1));
        assertEqAprox(t1.applyToPoint(p0), PGAPoint.fromCoords(-9, 1, 1, 1));
    });
    it('translate y', () => {
        const p0 = PGAPoint.fromCoords(1, 1, 1, 1);
        const t0 = PGAMotor.fromTranslation(new Vector3(0, +10, 0));
        const t1 = PGAMotor.fromTranslation(new Vector3(0, -10, 0));

        assertEqAprox(t0.applyToPoint(p0), PGAPoint.fromCoords(1, +11, 1, 1));
        assertEqAprox(t1.applyToPoint(p0), PGAPoint.fromCoords(1, -9, 1, 1));
    });
    it('translate z', () => {
        const p0 = PGAPoint.fromCoords(1, 1, 1, 1);
        const t0 = PGAMotor.fromTranslation(new Vector3(0, 0, +10));
        const t1 = PGAMotor.fromTranslation(new Vector3(0, 0, -10));

        assertEqAprox(t0.applyToPoint(p0), PGAPoint.fromCoords(1, 1, +11, 1));
        assertEqAprox(t1.applyToPoint(p0), PGAPoint.fromCoords(1, 1, -9, 1));
    });
    it('translation combined', () => {
        const p0 = PGAPoint.fromCoords(1, 1, 1, 1);
        const t0 = PGAMotor.fromTranslation(new Vector3(1, 1, 1));
        const t1 = PGAMotor.fromTranslation(new Vector3(2, 2, 2));

        assertEqAprox(t1.applyToPoint(t0.applyToPoint(p0)), PGAPoint.fromCoords(4, 4, 4, 1));
        assertEqAprox(t0.applyToPoint(t1.applyToPoint(p0)), PGAPoint.fromCoords(4, 4, 4, 1));
    });
    it('rotation combined', () => {
        const p0 = PGAPoint.fromCoords(1, 0, 0, 1);
        const q0 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI / 2);
        const q1 = PGAMotor.fromAngleAxis(new Vector3(1, 0, 0), Math.PI / 2);

        assertEqAprox(q1.applyToPoint(q0.applyToPoint(p0)), PGAPoint.fromCoords(0, 0, 1, 1));
        assertEqAprox(q0.applyToPoint(q1.applyToPoint(p0)), PGAPoint.fromCoords(0, 1, 0, 1));
    });
    it('combined off x', () => {
        const p0 = PGAPoint.fromCoords(1, 0, 0, 1);
        const t0 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI / 2);
        const t1 = PGAMotor.fromTranslation(new Vector3(5, 0, 0));

        const t01 = t0.geometricAntiproductWithMotor(t1);
        const t10 = t1.geometricAntiproductWithMotor(t0);
        assertEqAprox(t10.applyToPoint(p0), PGAPoint.fromCoords(5, 1, 0, 1));
        assertEqAprox(t01.applyToPoint(p0), PGAPoint.fromCoords(0, 6, 0, 1));
    })
    it('combined off y', () => {
        const p0 = PGAPoint.fromCoords(1, 0, 0, 1);
        const t0 = PGAMotor.fromAngleAxis(new Vector3(0, 0, 1), Math.PI / 2);
        const t1 = PGAMotor.fromTranslation(new Vector3(0, 5, 0));

        const t01 = t0.geometricAntiproductWithMotor(t1);
        const t10 = t1.geometricAntiproductWithMotor(t0);
        assertEqAprox(t10.applyToPoint(p0), PGAPoint.fromCoords(0, 6, 0, 1));
        assertEqAprox(t01.applyToPoint(p0), PGAPoint.fromCoords(-5, 1, 0, 1));
    })
});
