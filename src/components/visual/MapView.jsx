const MapView = () => {
    return (
      <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden mb-6 rounded-xl">
        <div className="relative">
          <img
            src="/map.jpg?height=300&width=600"
            alt="Map of Japan showing Tokyo and Kyoto"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="font-medium text-lg">Japan</h3>
            <div className="flex items-center text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                Tokyo
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                Kyoto
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default MapView
  