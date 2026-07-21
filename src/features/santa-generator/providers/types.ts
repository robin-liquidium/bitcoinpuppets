export type SantaHatInput = {
  puppet: File;
  santaHat: File;
  prompt: string;
};

export type SantaHatResult = {
  imageBase64: string;
};

export type SantaHatProvider = (
  input: SantaHatInput,
) => Promise<SantaHatResult>;
