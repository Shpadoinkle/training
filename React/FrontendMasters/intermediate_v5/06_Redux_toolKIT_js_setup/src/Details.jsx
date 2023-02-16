// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { adopt } from "./adoptedPetSlice";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
// import fetchPet from "./fetchPet";
import Modal from "./Modal";
// import AdoptedPetContext from "./AdoptedPetContext";
import { useGetPetQuery } from "./petAPIService";

const Details = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // const results = useQuery(["details", id], fetchPet);
  const { isLoading, data: pet } = useGetPetQuery(id);
  // Remove old context
  // const [_, setAdoptedPet] = useContext(AdoptedPetContext);

  // Use reducter
  const dispatch = useDispatch();

  if (isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🌀</h2>
      </div>
    );
  }

  return (
    <div className="details">
      <Carousel images={pet.images} />
      <div>
        <h1>{pet.name}</h1>
        <h2>{`${pet.animal} — ${pet.breed} — ${pet.city}, ${pet.state}`}</h2>
        <button onClick={() => setShowModal(true)}>Adopt {pet.name}</button>
        <p>{pet.description}</p>
        {showModal ? (
          <Modal>
            <div>
              <h1>Would you like to adopt {pet.name}?</h1>
              <div className="buttons">
                <button
                  onClick={() => {
                    // setAdoptedPet(pet);
                    dispatch(adopt(pet));
                    navigate("/");
                  }}
                >
                  Yes
                </button>
                <button onClick={() => setShowModal(false)}>No</button>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
