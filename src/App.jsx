"use client"

import { useState, useEffect, useReducer } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ChatContainer from "./components/chat/ChatContainer"
import VisualPane from "./components/visual/VisualPane"
import Header from "./components/layout/Header"
import { activities } from "./data/activities"
import { itinerary } from "./data/itinerary"
import "./styles/index.css"

// Chat flow states
const CHAT_STATES = {
  GREETING: 'greeting',
  SUGGESTING_ACTIVITIES: 'suggesting_activities',
  ACTIVITY_SELECTION: 'activity_selection',
  ITINERARY_SUGGESTION: 'itinerary_suggestion', 
  ITINERARY_CONFIRMATION: 'itinerary_confirmation',
  ADDITIONAL_INFO: 'additional_info'
}

// Action types for our reducer
const ACTIONS = {
  ADD_MESSAGE: 'add_message',
  SET_TYPING: 'set_typing',
  SHOW_VISUAL_PANE: 'show_visual_pane',
  SET_ACTIVE_ACTIVITY: 'set_active_activity',
  SET_SELECTED_ACTIVITIES: 'set_selected_activities',
  SHOW_ITINERARY: 'show_itinerary',
  TRANSITION_STATE: 'transition_state'
}

// Initial state
const initialState = {
  messages: [],
  isTyping: false,
  chatState: CHAT_STATES.GREETING,
  showVisualPane: false,
  selectedActivities: [],
  showItinerary: false,
  activeActivity: null
}

// Reducer function to handle all state updates
function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] }
    case ACTIONS.SET_TYPING:
      return { ...state, isTyping: action.payload }
    case ACTIONS.SHOW_VISUAL_PANE:
      return { ...state, showVisualPane: action.payload }
    case ACTIONS.SET_ACTIVE_ACTIVITY:
      return { ...state, activeActivity: action.payload }
    case ACTIONS.SET_SELECTED_ACTIVITIES:
      return { ...state, selectedActivities: action.payload }
    case ACTIONS.SHOW_ITINERARY:
      return { ...state, showItinerary: action.payload }
    case ACTIONS.TRANSITION_STATE:
      return { ...state, chatState: action.payload }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  
  // Helper function to add assistant message
  const addAssistantMessage = (content, additionalProps = {}) => {
    dispatch({ 
      type: ACTIONS.ADD_MESSAGE, 
      payload: {
        id: Date.now(),
        role: "assistant",
        content,
        ...additionalProps
      }
    })
  }
  
  // Helper function to simulate typing
  const simulateTyping = (callback, duration = 1000) => {
    dispatch({ type: ACTIONS.SET_TYPING, payload: true })
    setTimeout(() => {
      dispatch({ type: ACTIONS.SET_TYPING, payload: false })
      callback()
    }, duration)
  }

  // Start conversation flow
  useEffect(() => {
    if (state.messages.length === 0) {
      setTimeout(() => {
        simulateTyping(() => {
          addAssistantMessage(
            "Hi there! 👋 I'm your Japan travel assistant. I see you're planning a 4-day trip to Tokyo and Kyoto for a young couple who loves adventure, culture, and history. How can I help you plan your perfect Japan experience?"
          )
          dispatch({ type: ACTIONS.TRANSITION_STATE, payload: CHAT_STATES.SUGGESTING_ACTIVITIES })
        })
      }, 1000)
    }
  }, [])

  // Handle sending a message
  const handleSendMessage = (text) => {
    if (!text.trim()) return

    // Add user message
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: {
        id: Date.now(),
        role: "user",
        content: text,
      }
    })
    
    // Process user message
    processUserMessage(text)
  }

  // Process user message based on current chat state
  const processUserMessage = (text) => {
    dispatch({ type: ACTIONS.SET_TYPING, payload: true })
    
    // Randomize typing delay for more natural feel
    const delay = 1000 + Math.random() * 1500
    
    setTimeout(() => {
      dispatch({ type: ACTIONS.SET_TYPING, payload: false })
      
      // Handle response based on current state
      switch (state.chatState) {
        case CHAT_STATES.SUGGESTING_ACTIVITIES:
          handleActivitySuggestionResponse()
          break
          
        case CHAT_STATES.ACTIVITY_SELECTION:
          handleActivitySelectionResponse(text)
          break
          
        case CHAT_STATES.ITINERARY_SUGGESTION:
          handleItineraryConfirmation(text)
          break
          
        case CHAT_STATES.ITINERARY_CONFIRMATION:
          handleAdditionalInfoRequest(text)
          break
          
        case CHAT_STATES.ADDITIONAL_INFO:
          handleFinalResponse(text)
          break
          
        default:
          // Default fallback response
          addAssistantMessage("I hope you have a wonderful trip to Japan! Is there anything else you'd like to know?")
      }
    }, delay)
  }

  // Response handlers for each state
  const handleActivitySuggestionResponse = () => {
    addAssistantMessage(
      "Based on your preferences, I have two exciting activities to suggest that would be perfect for your trip:",
      { activities: [activities.tokyo, activities.kyoto] }
    )
    
    dispatch({ type: ACTIONS.SHOW_VISUAL_PANE, payload: true })
    dispatch({ type: ACTIONS.TRANSITION_STATE, payload: CHAT_STATES.ACTIVITY_SELECTION })
  }
  
  const handleActivitySelectionResponse = (text) => {
    // More intelligent parsing of user intent
    const lowerText = text.toLowerCase()
    const selectedActivitiesArray = []
    
    // Detect which activities were mentioned or selected
    if (lowerText.includes("go-kart") || lowerText.includes("tokyo") || lowerText.includes("both")) {
      selectedActivitiesArray.push(activities.tokyo)
      dispatch({ type: ACTIONS.SET_ACTIVE_ACTIVITY, payload: activities.tokyo })
    }
    
    if (lowerText.includes("tea") || lowerText.includes("kyoto") || lowerText.includes("both") || lowerText.includes("all")) {
      selectedActivitiesArray.push(activities.kyoto)
      if (!selectedActivitiesArray.includes(activities.tokyo)) {
        dispatch({ type: ACTIONS.SET_ACTIVE_ACTIVITY, payload: activities.kyoto })
      }
    }
    
    // If no clear selection was made, assume they want both
    if (selectedActivitiesArray.length === 0) {
      selectedActivitiesArray.push(activities.tokyo, activities.kyoto)
      dispatch({ type: ACTIONS.SET_ACTIVE_ACTIVITY, payload: activities.tokyo })
    }
    
    dispatch({ type: ACTIONS.SET_SELECTED_ACTIVITIES, payload: selectedActivitiesArray })
    
    // Custom response based on selection
    let responseText = ""
    if (selectedActivitiesArray.length === 1) {
      const activity = selectedActivitiesArray[0].title.includes("Go-Kart") ? "go-kart adventure in Tokyo" : "traditional tea ceremony in Kyoto"
      responseText = `Great choice! The ${activity} is an excellent pick. Based on this and your preferences, here's a suggested 4-day itinerary for your Japan trip:`
    } else {
      responseText = "Excellent choices! Both the go-kart tour in Tokyo and the traditional tea ceremony in Kyoto will give you a perfect mix of adventure and culture. Here's a suggested 4-day itinerary incorporating both experiences:"
    }
    
    addAssistantMessage(responseText, { showItinerary: true })
    dispatch({ type: ACTIONS.SHOW_ITINERARY, payload: true })
    dispatch({ type: ACTIONS.TRANSITION_STATE, payload: CHAT_STATES.ITINERARY_SUGGESTION })
  }
  
  const handleItineraryConfirmation = (text) => {
    const lowerText = text.toLowerCase()
    
    // Handle different responses to the itinerary
    if (lowerText.includes("perfect") || lowerText.includes("good") || lowerText.includes("great") || lowerText.includes("confirm")) {
      addAssistantMessage(
        "Wonderful! Your 4-day Japan adventure is now confirmed. You'll experience the perfect blend of adventure, culture, and history across Tokyo and Kyoto. Is there anything specific you'd like to know about your trip, such as transportation options, food recommendations, or budget tips?"
      )
    } else if (lowerText.includes("adjust") || lowerText.includes("change") || lowerText.includes("more")) {
      addAssistantMessage(
        "I understand you'd like some adjustments to the itinerary. The current plan already includes a balance of culture, history, and adventure, but I can certainly customize it further. What specific changes would you like to make? More nature activities, additional historical sites, or perhaps more time in a particular location?"
      )
    } else {
      addAssistantMessage(
        "Thanks for your feedback on the itinerary. Would you like to confirm this plan, or would you prefer some adjustments before we finalize it? We can also discuss specific aspects of your trip like transportation, food recommendations, or cultural tips."
      )
    }
    
    dispatch({ type: ACTIONS.TRANSITION_STATE, payload: CHAT_STATES.ITINERARY_CONFIRMATION })
  }
  
  const handleAdditionalInfoRequest = (text) => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes("transport") || lowerText.includes("between") || lowerText.includes("travel")) {
      addAssistantMessage(
        "For transportation between Tokyo and Kyoto, I recommend taking the Shinkansen (bullet train). It's the fastest option, taking about 2.5 hours. The trains are comfortable, punctual, and offer beautiful views of the Japanese countryside. A one-way ticket costs around ¥13,000 (~$90), but you might want to consider a Japan Rail Pass if you plan to use the train multiple times.\n\nWhat else would you like to know about your trip?"
      )
    } else if (lowerText.includes("food") || lowerText.includes("eat") || lowerText.includes("restaurant")) {
      addAssistantMessage(
        "Japan offers amazing culinary experiences! In Tokyo, don't miss trying fresh sushi at Tsukiji Outer Market, ramen in Shinjuku, and street food in Asakusa. In Kyoto, try traditional kaiseki (multi-course) dining, matcha desserts, and Kyoto-style sushi which is often pressed. Both cities have excellent izakayas (Japanese pubs) for evening dining with drinks.\n\nAny other aspects of your trip you'd like information about?"
      )
    } else if (lowerText.includes("budget") || lowerText.includes("cost") || lowerText.includes("money") || lowerText.includes("expensive")) {
      addAssistantMessage(
        "For a 4-day trip to Japan, here's a rough budget breakdown:\n\n• Accommodation: $100-200 per night for a mid-range hotel\n• Food: $30-60 per person per day (more if dining at upscale restaurants)\n• Transportation: $120 for a one-way Shinkansen ticket between Tokyo and Kyoto, plus $10-15 daily for local transit\n• Activities: $20-50 per activity (the go-kart tour is about $85, tea ceremony around $50)\n• Shopping/souvenirs: Depends on your preferences\n\nTotal estimate: $800-1200 per person for 4 days, excluding international flights.\n\nDo you have any other questions about your trip planning?"
      )
    } else {
      addAssistantMessage(
        "I'm glad I could help plan your Japan adventure! You're going to have an amazing time exploring Tokyo's vibrant energy and Kyoto's traditional charm. If you have any more questions before your trip, feel free to ask. Safe travels and enjoy your journey! 🇯🇵"
      )
    }
    
    dispatch({ type: ACTIONS.TRANSITION_STATE, payload: CHAT_STATES.ADDITIONAL_INFO })
  }
  
  const handleFinalResponse = (text) => {
    const lowerText = text.toLowerCase()
    
    // Provide responses to specific topics in the additional info phase
    if (lowerText.includes("weather") || lowerText.includes("season") || lowerText.includes("temperature")) {
      addAssistantMessage(
        "Japan's weather varies significantly by season. Spring (March-May) brings cherry blossoms with mild temperatures (10-20°C). Summer (June-August) is hot and humid (25-35°C) with occasional rain. Fall (September-November) offers colorful foliage and pleasant temperatures (15-25°C). Winter (December-February) is cold (0-10°C) with potential snow, especially in northern regions.\n\nFor Tokyo and Kyoto specifically, they share similar seasonal patterns, but Kyoto can be slightly more extreme – hotter in summer and colder in winter. Always check the forecast before your trip and pack accordingly!"
      )
    } else if (lowerText.includes("language") || lowerText.includes("speak") || lowerText.includes("english")) {
      addAssistantMessage(
        "While English isn't widely spoken in Japan, especially outside major tourist areas, you can still navigate comfortably as a tourist. Here are some tips:\n\n• Learn basic Japanese phrases (hello, thank you, excuse me)\n• Use translation apps like Google Translate\n• In Tokyo and Kyoto, major attractions, hotels, and train stations usually have English signage\n• Many restaurants offer picture menus or food displays\n• Younger Japanese people often understand some English\n\nJapanese people are generally helpful and will try to assist even with language barriers. Don't be afraid to use gestures when needed!"
      )
    } else if (lowerText.includes("thank")) {
      addAssistantMessage(
        "You're very welcome! I'm happy I could help plan your Japan adventure. You're going to have an incredible experience exploring both the modern excitement of Tokyo and the traditional beauty of Kyoto. If you think of any other questions before your trip, don't hesitate to ask. Safe travels and enjoy every moment of your journey! 🇯🇵✨"
      )
    } else {
      // Generic final response for any other query
      addAssistantMessage(
        "I'm glad I could help with your Japan travel planning! Is there anything else you'd like to know before your trip? I can provide information on cultural etiquette, shopping recommendations, nightlife options, or any other aspects of your Japanese adventure you're curious about."
      )
    }
    
    // Stay in the same state for further questions
  }

  // Suggested responses based on current chat state
  const getSuggestedResponses = () => {
    switch (state.chatState) {
      case CHAT_STATES.GREETING:
      case CHAT_STATES.SUGGESTING_ACTIVITIES:
        return [
          "I'd love some activity suggestions for our trip!",
          "What activities do you recommend for a young couple?",
          "We're interested in both adventure and culture. What do you suggest?",
        ]
      case CHAT_STATES.ACTIVITY_SELECTION:
        return [
          "The go-kart tour in Tokyo sounds amazing!",
          "The tea ceremony in Kyoto looks perfect for us.",
          "Both activities look great! Can we do both?",
        ]
      case CHAT_STATES.ITINERARY_SUGGESTION:
        return [
          "This itinerary looks perfect! Let's confirm it.",
          "Can we adjust the itinerary to include more nature activities?",
          "The itinerary looks good. What about food recommendations?",
        ]
      case CHAT_STATES.ITINERARY_CONFIRMATION:
        return [
          "What about transportation between Tokyo and Kyoto?",
          "Any food recommendations for our trip?",
          "What's the typical budget for this trip?",
        ]
      case CHAT_STATES.ADDITIONAL_INFO:
        return [
          "What should we know about the weather?",
          "How difficult is it with the language barrier?",
          "Thank you for all your help!",
        ]
      default:
        return []
    }
  }

  // Handle activity selection
  const handleActivitySelect = (activity) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_ACTIVITY, payload: activity })
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Chat section - always visible */}
        <div className={`flex flex-col ${state.showVisualPane ? "w-3/5" : "w-full"} transition-all duration-500`}>
          <ChatContainer
            messages={state.messages}
            isTyping={state.isTyping}
            suggestedResponses={getSuggestedResponses()}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Visual pane - appears after activity selection */}
        <AnimatePresence>
          {state.showVisualPane && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "40%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="border-l border-gray-200 bg-white overflow-hidden"
            >
              <VisualPane
                selectedActivities={state.selectedActivities}
                activeActivity={state.activeActivity}
                showItinerary={state.showItinerary}
                itinerary={itinerary}
                onActivitySelect={handleActivitySelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}