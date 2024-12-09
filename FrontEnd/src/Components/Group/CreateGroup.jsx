// import React from "react";
import { useRef, useState } from "react";
import { GroupLogo } from "../../Constants/GroupLogo";
import axios from "axios";
import { API } from "../../Utils/API";

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

  const handleOnSubmit = async(e) => {
    e.preventDefault();
    try {
      const data={
        name:refName.current.value,
        password:refPassword.current.value,
        description:refDescription.current.value,
        type:type,
        avatar:GroupLogo[selectedLogo],
        owner:id
      }
      const response=await axios.post(`${API}/api/group/create`,data,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="container align-middle mx-auto">
      <form onSubmit={handleOnSubmit} className="bg-white p-10 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full mb-10">
          <div className="flex flex-wrap flex-1 shrink gap-5 items-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
            <div>
            <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
              <div className="aspect-auto">
                <img src={GroupLogo[selectedLogo]} alt="Description of SVG" />
              </div>

            </div>
            <span className="font-semibold">Group Icon</span></div>
            <div className="flex justify-center items-center relative transition-all duration-[450ms] ease-in-out w-auto">
              <article className="border border-solid border-gray-700 w-full ease-in-out duration-500 left-0 rounded-2xl flex shadow-lg shadow-black/15 bg-white">
                {GroupLogo.map((logo, index) => (
                  <label
                    key={index}
                    className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
                    htmlFor={`logo-${index}`}
                  >
                    <input
                      id={`logo-${index}`}
                      name="logo"
                      type="radio"
                      onChange={() => setSelectedLogo(index)}
                      value={index}
                      checked={selectedLogo === index}
                      className="hidden peer/expand"
                    />
                    <img
                      src={logo}
                      alt="Description of SVG"
                      className="w-8 h-8"
                    />
                  </label>
                ))}
              </article>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div id="input" className="relative">
            <input
              type="text"
              id="floating_outlined"
              className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
              placeholder="Group Name"
              ref={refName}
              // value=""
            />
            <label
              htmlFor="floating_outlined"
              className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transhtmlForm -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Group name
            </label>
          </div>

          <div className="flex gap-2 p-2">
            <div>
              <input
                className="peer sr-only"
                value="Private"
                name="gender"
                id="Private"
                checked={type==="Private"}
                onChange={()=>setType("Private")}
                type="radio"
              />
              <div className="flex h-16 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-green-400 active:scale-95 peer-checked:border-green-500 peer-checked:shadow-md peer-checked:shadow-green-400">
                <label
                  className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-green-500"
                  htmlFor="Private"
                >
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
                  Private
                </label>
              </div>
            </div>
            <div>
              <input
                className="peer sr-only"
                value="Public"
                name="gender"
                id="Public"
                checked={type==="Public"}
                onChange={()=>setType("Public")}
                type="radio"
              />
              <div className="flex h-16 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-blue-400 active:scale-95 peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-400">
                <label
                  className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-blue-500"
                  htmlFor="Public"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="h-7 w-6 fill-gray-100"
                    version="1.1"
                    id="Public"
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
                  Public
                </label>
              </div>
            </div>
          </div>

          <div id="input" className="relative">
            <input
              type="text"
              id="floating_outlined"
              className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
              placeholder="Password"
              ref={refPassword}
              // value=""
            />
            <label
              htmlFor="floating_outlined"
              className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transhtmlForm -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Password
            </label>
          </div>

          <div id="input" className="relative">
            <input
              type="text"
              id="floating_outlined"
              className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
              placeholder="Description"
              ref={refDescription}
              // value=""
            />
            <label
              htmlFor="floating_outlined"
              className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transhtmlForm -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Description
            </label>
          </div>
        </div>

        <div className="sm:flex sm:flex-row-reverse flex gap-4">
          <button
            className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-violet-500 hover:bg-violet-600 focus:bg-violet-700 border-violet-500-violet- text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300"
            type="submit"

          >
            <div className="flex gap-2 items-center">Save changes</div>
          </button>
          <button
            className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary focus:ring-4 focus:ring-gray-100"
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
