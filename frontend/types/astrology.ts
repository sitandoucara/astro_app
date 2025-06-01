export interface PlanetData {
  name: string;
  full_degree: number;
  norm_degree: number;
  speed: number;
  is_retro: boolean;
  house: number;
  sign: string;
  sign_degree: number;
  position: string;
}

export interface AscendantData {
  degree: number;
  sign: string;
  position: string;
}
