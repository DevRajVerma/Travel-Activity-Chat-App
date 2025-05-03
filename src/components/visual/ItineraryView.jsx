"use client"

import { motion } from "framer-motion"

const ItineraryView = ({ itinerary }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-md font-medium text-gray-800 mb-2">Your 4-Day Itinerary</h3>
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div key={index} className="bg-gray-200 rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${
                    day.city === "Tokyo" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                  } flex items-center justify-center mr-3`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{day.title}</div>
                  <div className="text-sm text-gray-600">{day.city}</div>
                </div>
              </div>

              <div className="mt-3 pl-13 ml-7 border-l-2 border-gray-200 space-y-3 ">
                {day.activities.map((activity, i) => (
                  <div key={i} className="relative ">
                    <div className="absolute -left-[15px] top-1.5 w-3 h-3 rounded-full bg-gray-200"></div>
                    <div className="text-sm">
                      <span className="font-medium">{activity.time}</span> - {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ItineraryView
