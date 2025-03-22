import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, photoURL, about } = user;
  return (
    <>
      <div>
      <div className="card bg-base-200  shadow-sm">
        <figure>
          {photoURL && <img src={photoURL} alt="photo" className="h-50 w-full" />}
        </figure>
        <div className="card-body">
          <h2 className="card-title ">{firstName + " " + lastName}</h2>
          {age && gender && (
            <>
              <h4>{age + ", " + gender}</h4>
              <h4>{about}</h4>
            </>
          )}
          <div className="card-action my-4 flex justify-center gap-1">
            <button className="btn bg-secondary">Interested</button>
            <button className="btn bg-primary">Ignore</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default UserCard;
