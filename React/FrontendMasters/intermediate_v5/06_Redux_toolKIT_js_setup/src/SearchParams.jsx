import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import Results from "./Results";
// import AdoptedPetContext from "./AdoptedPetContext";
import { useSelector, useDispatch } from "react-redux";
import useBreedList from "./useBreedList";
// import fetchSearch from "./fetchSearch";
import { all } from "./searchParamsSlice";
import { useSearchQuery } from "./petAPIService";
const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];

const SearchParams = () => {
  // remove old code
  // const [adoptedPet] = useContext(AdoptedPetContext);

  // new reducer code
  const searchParams = useSelector((state) => state.searchParams.value);
  const adoptedPet = useSelector((state) => state.adoptedPet.value);
  const [animal, setAnimal] = useState("");
  const [breeds] = useBreedList(animal);
  const dispatch = useDispatch();

  // const results = useQuery(["search", searchParams], fetchSearch);
  let { data: pets } = useSearchQuery(searchParams);
  pets = pets ?? [];
  // const pets = results?.data?.pets ?? [];

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            breed: formData.get("breed") ?? "",
            location: formData.get("location") ?? "",
          };
          // setRequestParams(obj);
          dispatch(all(obj));
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input id="location" name="location" placeholder="Location" />
        </label>

        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            name="animal"
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
            onBlur={(e) => {
              setAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="breed">
          Breed
          <select disabled={!breeds.length} id="breed" name="breed">
            <option />
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>

        <button>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
