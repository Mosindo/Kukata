import React from "react";

const landingpage = () => {
  return (
    <div className="grid grid-cols-2 gap-8 p-10">
      <div className="space-y-6">
        <div className="bg-green-800 p-6 rounded-lg shadow-lg">
          <img
            src="https://placehold.co/300x300"
            alt="Profile image with a man having green colored hair and beard, looking to the side"
            className="w-full h-auto rounded-lg"
          />
          <h2 className="text-2xl font-bold mt-4">Rdoth</h2>
          <p className="text-green-300">Jiawenismo</p>
          <p className="mt-4">
            Dertails: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus lacinia odio vitae vestibulum.
          </p>
          <button className="mt-4 bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition-colors">
            Contact
          </button>
        </div>

        <div className="bg-green-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Mteloe Cok</h3>
          <p className="text-green-300">SA</p>
          <p className="text-sm mt-4">
            VACUS: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p className="text-xs mt-2">
            BATLELISO: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <button className="mt-4 bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition-colors">
            Contact
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-green-800 p-6 rounded-lg shadow-lg flex items-center space-x-6">
          <img
            src="https://placehold.co/200x200"
            alt="Close up profile image with a man having green colored hair and beard, facing forward"
            className="w-48 h-48 rounded-full"
          />
          <div>
            <h2 className="text-3xl font-bold">Call</h2>
            <p className="text-green-300 text-2xl">CAH ARDAI Chaih</p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>
            <div className="flex items-center mt-4">
              <button className="bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition-colors">
                Contact
              </button>
              <span className="text-green-300 ml-4">
                <i className="fas fa-phone-alt"></i> 0645
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-800 p-6 rounded-lg shadow-lg flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Roche Cok</h3>
            <p className="text-green-300">BHID 6fdom</p>
            <p className="text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>
          </div>
          <div>
            <span className="text-green-300 text-xl">
              <i className="fas fa-wallet"></i> $490
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default landingpage;
