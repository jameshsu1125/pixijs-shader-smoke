export default class PixiShaderSmoke {
    container: HTMLElement;
    width: number;
    height: number;
    smokeHeight: string;
    c5: string;
    c6: string;
    noise: string;
    onload?: () => void;
    constructor({ container, height, onload, c5, c6, noise, }: {
        container: HTMLElement;
        height: string;
        onload?: () => void;
        c5?: string;
        c6?: string;
        noise?: string;
    });
    init(): void;
}
