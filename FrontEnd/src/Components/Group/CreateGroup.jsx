// import React from "react";
import { useRef, useState } from "react";
import { GroupLogo } from "../../Constants/GroupLogo";
import axios from "axios";
import { API } from "../../Utils/API";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const user = localStorage.getItem('user');
const id = user ? JSON.parse(user).id : null;
function CreateGroup() {
  const [selectedLogo, setSelectedLogo] = useState(
    Math.floor(Math.random() * 6)
  );
  const [type,setType]=useState("Public");
  const refName=useRef("");
  const refPassword=useRef("");
  const refDescription=useRef("");
  const navigate=useNavigate();

  const handleOnSubmit = async(e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!refName.current.value) {
        return toast.error("Group name is required");
      }

      if (type === "Private" && !refPassword.current.value) {
        return toast.error("Password is required for private groups");
      }

      const data = {
        name: refName.current.value,
        password: type === "Private" ? refPassword.current.value : undefined,
        description: refDescription.current.value,
        type: type,
        avatar: GroupLogo[selectedLogo],
        owner: id
      }

      const response = await axios.post(`${API}/api/group/create`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success("Group created successfully!");
        navigate('/group');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
      console.error(err);
    }
  }

  const handleCancel = () => {
    navigate('/group');
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <form onSubmit={handleOnSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
        {/* Group Icon Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Create New Group</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <div className="bg-gray-100 h-20 w-20 rounded-2xl overflow-hidden mb-2">
                <img 
                  src={GroupLogo[selectedLogo]} 
                  alt="Group Icon" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-600">Selected Icon</span>
            </div>
            
            <div className="flex-1 min-w-[240px]">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-3 border rounded-xl bg-gray-50">
                {GroupLogo.map((logo, index) => (
                  <label
                    key={index}
                    className={`cursor-pointer rounded-lg p-2 transition-all duration-300 
                      ${selectedLogo === index ? 'bg-white shadow-md ring-2 ring-violet-500' : 'hover:bg-white hover:shadow-sm'}`}
                  >
                    <input
                      type="radio"
                      name="logo"
                      value={index}
                      checked={selectedLogo === index}
                      onChange={() => setSelectedLogo(index)}
                      className="hidden"
                    />
                    <img src={logo} alt={`Icon ${index + 1}`} className="w-full h-auto" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Group Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Group Type</label>
          <div className="flex gap-4">
            <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all
              ${type === "Public" ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
              <input
                type="radio"
                value="Public"
                name="type"
                checked={type === "Public"}
                onChange={() => setType("Public")}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="h-7 w-6 fill-gray-100"
                version="1.1"
                viewBox="0 0 511.999 511.999"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    style={{ fill: "#211E48" }}
                    d="M429.202,408.079c-0.008,0-0.015,0-0.023,0l-352.95-0.515c-31.387-0.046-59.56-21.09-68.511-51.175   l-4.794-16.122c-8.948-30.085,3.142-63.106,29.401-80.299L327.613,66.63c4.068-2.662,9.151-3.246,13.717-1.575   c4.565,1.671,8.071,5.402,9.456,10.06l92.875,312.225c0.617,1.666,0.955,3.471,0.955,5.352c0,8.497-6.888,15.385-15.385,15.385   C429.225,408.079,429.211,408.079,429.202,408.079z M327.182,103.689L49.179,285.711c-14.971,9.803-21.865,28.63-16.764,45.784   l4.794,16.12c5.103,17.153,21.167,29.152,39.064,29.178l332.291,0.485L327.182,103.689z"
                  />
                  <path
                    style={{ fill: "#211E48" }}
                    d="M172.444,482.567c-50.515,0-90.927-38.869-91.999-88.49c-0.183-8.494,6.556-15.531,15.05-15.714   c8.468-0.155,15.531,6.554,15.714,15.048c0.708,32.739,27.604,58.385,61.236,58.385c17.745,0,34.607-7.691,46.263-21.098   c5.572-6.412,15.291-7.092,21.704-1.518s7.092,15.291,1.517,21.705C224.429,471.021,199.102,482.567,172.444,482.567z"
                  />
                </g>
                <polygon
                  style={{ fill: "#B0DACC" }}
                  points="229.28,149.403 301.594,392.508 429.202,392.694 336.041,79.501 "
                />
                <g>
                  <path
                    style={{ fill: "#211E48" }}
                    d="M429.202,408.077c-0.008,0-0.015,0-0.023,0l-127.608-0.186c-6.799-0.009-12.786-4.482-14.723-10.999   l-72.314-243.104c-1.938-6.517,0.631-13.533,6.319-17.257L327.613,66.63c4.066-2.662,9.151-3.246,13.717-1.575   c4.565,1.671,8.069,5.402,9.456,10.06l93.163,313.192c1.385,4.659,0.488,9.699-2.42,13.593   C438.624,405.788,434.054,408.077,429.202,408.077z M313.074,377.14l95.492,0.138l-81.384-273.589l-79.891,52.309L313.074,377.14z"
                  />
                  <path
                    style={{ fill: "#211E48" }}
                    d="M439.714,442.631c-6.632,0-12.753-4.322-14.74-11.002L311.22,49.206   c-2.422-8.143,2.215-16.71,10.359-19.133c8.151-2.42,16.711,2.215,19.134,10.36l113.754,382.421   c2.422,8.143-2.215,16.71-10.359,19.133C442.644,442.423,441.165,442.631,439.714,442.631z"
                  />
                  <path
                    style={{ fill: "#211E48" }}
                    d="M422.446,144.027c-2.194,0-4.42-0.471-6.537-1.466c-7.688-3.615-10.991-12.78-7.376-20.47   l16.768-35.659c3.617-7.691,12.779-10.994,20.471-7.376c7.688,3.615,10.991,12.78,7.376,20.47l-16.768,35.659   C433.759,140.758,428.223,144.027,422.446,144.027z"
                  />
                  <path
                    style={{ fill: "#211E48" }}
                    d="M457.698,225.156c-6.954,0-13.259-4.746-14.95-11.805c-1.98-8.263,3.114-16.567,11.379-18.545   l38.9-9.317c8.265-1.98,16.567,3.115,18.545,11.379c1.98,8.263-3.114,16.567-11.379,18.547l-38.9,9.317   C460.09,225.019,458.884,225.156,457.698,225.156z"
                  />
                  <path
                    style={{ fill: "#211E48" }}
                    d="M494.136,337.643c-3.302,0-6.628-1.059-9.436-3.242l-31.104-24.191   c-6.706-5.217-7.916-14.882-2.699-21.59c5.22-6.709,14.885-7.914,21.59-2.699l31.104,24.191c6.706,5.217,7.916,14.882,2.699,21.59   C503.258,335.602,498.721,337.643,494.136,337.643z"
                  />
                </g>
              </svg>
              <span className="font-medium">Public</span>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all
              ${type === "Private" ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
              <input
                type="radio"
                value="Private"
                name="type"
                checked={type === "Private"}
                onChange={() => setType("Private")}
                className="hidden"
              />
              <svg
                id="Private"
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-6 fill-gray-100"
                viewBox="0 0 1024 1024"
              >
                <circle
                  cx="512"
                  cy="512"
                  r="512"
                  style={{ fill: "#56b14e" }}
                />
                <path
                  data-name="PIA logo (monochrome version by krisu)"
                  d="M486.59 371c0-15.43-18.66-23.16-29.57-12.26s-3.19 29.58 12.24 29.58a17.32 17.32 0 0 0 17.32-17.33m68.18-17.31c-15.43 0-23.18 18.65-12.26 29.57s29.58 3.17 29.57-12.26a17.31 17.31 0 0 0-17.31-17.31m-18.66 45.89a36 36 0 0 1-48.17 0c-4.37-3.69-10.12 2.53-6.09 6.6a44 44 0 0 0 60.37 0 4.5 4.5 0 0 0-6.11-6.6m159.63 67v-.25a36.09 36.09 0 0 0-26.22-34.7v-30.91A152.73 152.73 0 0 0 516.79 248h-5.84a152.73 152.73 0 0 0-152.73 152.71v30.12A36.09 36.09 0 0 0 328.59 466a51.34 51.34 0 0 0-7.09 26v195.85a51.54 51.54 0 0 0 38.1 49.74A37.7 37.7 0 0 0 394.06 760h42.84a37.69 37.69 0 0 0 33.6-20.59h78.59A37.68 37.68 0 0 0 582.66 760h42.85a37.72 37.72 0 0 0 34-21.37 51.57 51.57 0 0 0 43-50.82V492.06a51.31 51.31 0 0 0-6.78-25.49zM559.55 656.36a23.1 23.1 0 0 1-22.84 26.46H487.3a23.12 23.12 0 0 1-22.85-26.44l9.55-64.56a58.61 58.61 0 0 1 31.4-102.87A58.62 58.62 0 0 1 550 591.83zm5.58-215.88h-106A35.88 35.88 0 0 0 434 430.24h-18v-32.06a95.65 95.65 0 0 1 95.62-95.64h4.67a95.65 95.65 0 0 1 95.62 95.64v32.06h-21.6a35.89 35.89 0 0 0-25.18 10.24zm-21.94 219a5.49 5.49 0 0 1-5.37 6.89h-51.33a5.48 5.48 0 0 1-5.36-6.91l9.87-71.23a8.49 8.49 0 0 0-.44-3.13 16 16 0 0 0-3.16-3.21c-.18-.15-.31-.26-.42-.36a42.24 42.24 0 1 1 50.43-.31c0 .07-.16.28-.65.68a16 16 0 0 0-3.16 3.21 5.22 5.22 0 0 0-.32 1.42z"
                  style={{ fill: "#fff" }}
                />
              </svg>
              <span className="font-medium">Private</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              ref={refName}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Enter group name"
            />
          </div>

          {type === "Private" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                ref={refPassword}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Enter group password"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              ref={refDescription}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Enter group description"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-all"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
