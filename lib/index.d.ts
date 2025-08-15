export default class PixiShaderSmoke {
    container: HTMLElement;
    width: number;
    height: number;
    smokeHeight: string;
    onload?: () => void;
    constructor({ container, height, onload, }: {
        container: HTMLElement;
        height: string;
        onload?: () => void;
    });
    init(): void;
}
