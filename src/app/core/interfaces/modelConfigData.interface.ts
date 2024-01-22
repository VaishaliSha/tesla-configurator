export interface ModelConfigData {
    [key: string]: ModelConfig;
}

export interface ModelConfig {
    configs: Config[];
    towHitch?: boolean;
    yoke?: boolean;
}

export interface ConfigDetail {
    configDetails: Config;
    towHitch: boolean;
    steeringWheel: boolean;
}

export interface Config {
    id: number;
    description: string;
    range: number;
    speed: number;
    price: number;
}
