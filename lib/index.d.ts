import * as PIXI from 'pixi.js';
export default class PixiShaderSmoke {
    container: HTMLElement;
    width: number;
    height: number;
    smokeHeight: string;
    c5: string;
    c6: string;
    noise: string;
    onload?: () => void;
    shaderImage: string;
    renderer: PIXI.Renderer | null;
    uniforms: {
        [key: string]: {
            type: string;
            value: any;
        };
    };
    bg: PIXI.Sprite | null;
    fps: number;
    constructor({ container, height, onload, c5, c6, noise, shaderImage, fps, }: {
        container: HTMLElement;
        height: string;
        onload?: () => void;
        c5?: string;
        c6?: string;
        noise?: string;
        shaderImage?: string;
        fps?: number;
    });
    init(): void;
    resizeTo(width: number, height: number): void;
}
