export default function loading() {
  return (
    <>
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <div>
            <h3 className="font-bold"></h3>
            <div className="mt-5 flex">
              <img
                src="https://images.otstatic.com/prod1/49153814/2/medium.jpg"
                alt=""
                className="w-32 h-18 rounded"
              />
              <div className="ml-4">
                <h1 className="text-3xl font-bold"></h1>
                <div className="flex mt-3">
                  <p className="mr-6"></p>
                  <p className="mr-6"></p>
                  <p className="mr-6"></p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-between w-[660px]">
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="First name"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Last name"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Phone number"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Email"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Occasion (optional)"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Requests (optional)"
            />
            <button className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300">
              Complete reservation
            </button>
            <p className="mt-4 text-sm"></p>
          </div>
        </div>
      </div>
    </>
  );
}
