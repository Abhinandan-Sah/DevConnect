import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, photoURL } = user;
  return (
    <>
      <div className="card bg-base-500 w-96 shadow-sm">
        <figure>
          <img src={photoURL} alt="photo" className="h-50 w-fit" />
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
    </>
  );
};

export default UserCard;
