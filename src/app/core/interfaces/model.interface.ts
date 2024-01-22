export interface Model {
    code: string;
    description: string;
    colors: Color[];
}

export interface Color {
    code: string;
    description: string;
    price: number;
}

export type ModelWithoutColors = Omit<Model, 'colors'>;

export interface SelectedConfig {
    model: ModelWithoutColors;
    color: Color;
}
