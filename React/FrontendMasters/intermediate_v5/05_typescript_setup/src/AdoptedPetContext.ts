import { createContext } from "react";
import { Pet } from "./APIResponsesTypes";

const AdoptedPetContext = createContext<
  [Pet | null, (adoptedPet: Pet) => void]
>([
  {
    id: 1,
    name: "testDog",
    animal: "bird",
    description: "",
    breed: "beagle",
    images: [],
    city: "ss",
    state: "",
  },
  () => {},
]);

export default AdoptedPetContext;
