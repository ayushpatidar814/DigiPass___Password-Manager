import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";


const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    let req = await fetch("https://digi-pass-backend.vercel.app") 
    let passwords = await req.json()
    // console.log(passwords)
    setPasswordArray(passwords);
  } 

  useEffect(() => {
    getPasswords()
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("eye-slash.svg")) {
      ref.current.src = "eye.svg";
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
      ref.current.src = "eye-slash.svg";
    }
  };

  const savePassword = async () => {
    if(form.site.length >3 && form.username.length>3 && form.password.length >3){
      // If any such id exists in the db, delete it 
      // await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })


    setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
    await fetch("https://digi-pass-backend.vercel.app", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...form, id: uuidv4() })})
    // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
    setform({ site: "", username: "", password: "" });
    toast("Password Saved!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  else{
    toast("Error: Password not saved!")
  }
  };

  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id)
    let c = confirm("Do you really want to delete this password?")
    if (c) {
        setPasswordArray(passwordArray.filter(item => item.id !== id))
        
        await fetch("https://digi-pass-backend.vercel.app/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

        toast('Password Deleted!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true, 
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
  };

  const editPassword = (id) => {
    setform({...passwordArray.filter((item) => item.id === id)[0], id: id });
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className=" p-2 mycontainer min-h-[88.2vh]">
        <h1 className="text-3xl text font-bold text-center">
          <span className="text-green">&lt;</span>
          <span>DigiPass</span>
          <span className="text-green">&gt;</span>
        </h1>
        <p className="text-green-900 text-center">Your own Password Manager</p>

        <div className="flex flex-col p-2 text-black gap-2 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            type="text"
            name="site"
            id="site"
            className="rounded-full border border-green-500 w-full p-4 py-1"
          />

          <div className="flex p-2 text-black gap-4 items-center mycontainer">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              type="text"
              name="username"
              id="username"
              className="rounded-full border border-green-500 w-full p-2 py-1"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                type="password"
                name="password"
                id="password"
                className="rounded-full border border-green-500 md:w-60 w-30 p-2 py-1"
              />
              <span
                onClick={showPassword}
                className="absolute right-[3px] top-[4px] cursor-pointer"
              >
                <img
                  ref={ref}
                  src="/eye.svg"
                  alt="eye"
                  className="p-1"
                  width={26}
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-8 py-1 w-fit border border-green-900"
          >
            <lord-icon src="" trigger="hover"></lord-icon>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-xl py-2 pt-0">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white underline">
                <tr>
                  <th className="py-1">Site</th>
                  <th className="py-1">Username</th>
                  <th className="py-1">Password</th>
                  <th className="py-1">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100 mx-2">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-1 border border-white w-32">
                        <div className="flex justify-center gap-2">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <img
                            onClick={() => {
                              copyText(item.site);
                            }}
                            className="w-auto h-6 pt-1 cursor-pointer"
                            src="/copy.svg"
                            alt="copy"
                          />
                        </div>
                      </td>
                      <td className="py-1 border border-white w-32">
                        <div className="flex justify-center gap-2">
                          <div>{item.username}</div>
                          <img
                            onClick={() => {
                              copyText(item.username);
                            }}
                            className="w-auto h-6 pt-1 cursor-pointer"
                            src="/copy.svg"
                            alt="copy"
                          />
                        </div>
                      </td>
                      <td className="py-1 border border-white w-32">
                        <div className="flex justify-center gap-2">
                          <div>{"*".repeat(item.password.length)}</div>
                          <img
                            onClick={() => {
                              copyText(item.password);
                            }}
                            className="w-auto h-6 pt-1 cursor-pointer"
                            src="/copy.svg"
                            alt="copy"
                          />
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center w-32">
                        <div className="flex justify-center gap-4">
                          <img
                            onClick={() => {
                              editPassword(item.id);
                            }}
                            className="w-auto h-5 cursor-pointer"
                            src="/edit.svg"
                            alt="edit"
                          />
                          <img
                            onClick={() => {
                              deletePassword(item.id);
                            }}
                            className="w-auto h-5 cursor-pointer"
                            src="/delete.svg"
                            alt="delete"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
