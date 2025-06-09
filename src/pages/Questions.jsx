import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, BookOpen, Heart, Smile } from "lucide-react";
import db from "../appwrite/databases";
import {ID, Query} from "appwrite";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useStore } from "../store/store";

import { getScore } from "../gemini/Manas";
// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const inputVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

const initialFormState = {
  // Section A: General Information
  "Full Name": "",
  "Age": "",
  "Sex": "",
  "Date of Assessment": "",
  "Contact Information": "",
  Occupation: "",
  "Emergency Contact": "",
  "FamilyType":"",
  "FamilyMember":"",

  // Section B: Mental Health History
  diagnosed: "",
  treatment: "",
  treatmentType: "",
  provider: "",
  hospitalized: "",
  hospitalReason: "",

  // Section C: Symptom Checklist (Past 2 Weeks)
  "Feeling down, depressed, or hopeless": "",
  "Little interest or pleasure in doing things": "",
  "Feeling nervous, anxious, or on edge": "",
  "Trouble relaxing": "",
  "Excessive worry": "",
  "Fatigue or low energy": "",
  "Changes in appetite": "",
  "Sleep disturbances": "",
  "Difficulty concentrating": "",
  "Thoughts of self-harm or suicide": "",

  // Section D: Behavioral Patterns
  dailyFunction: "",
  substanceUse: "",
  substanceDetails: "",
  lifeChanges: "",
  changeDetails: "",

  // Section E: Social & Emotional Well-being
  connectedness: "",
  safety: "",
  safetyDetails: "NO",
  hobbies: "",
  copingStrategies: [], // multiple checkbox values stored as array
};



const MoodMigoQuestionnaire = () => {
  const userID = useStore((state) => state.User.id);
  const [interpretation,setinterpretation]=useState("")
  // const score = useStore((state) => state.score);
  // const setScore = useStore((state) => state.setScore);
  const [form, setForm] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const user = useStore((state) => state.User);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const [score,setScore]=useState(0)
 const handleSubmit = async (e) => {
  console.log(typeof(userID))
  e.preventDefault();
  
  // STEP 1: Validate all fields are filled
 const requiredFields = [
  // Section A: General Information
  "Age",
  "Sex",
  "Date of Assessment",
  "Contact Information",
  "Occupation",
  "Emergency Contact",
  "FamilyType",
  "FamilyMember",

  // Section B: Mental Health History
  "diagnosed",
  "treatment",
  "treatmentType",
  "provider",
  "hospitalized",
  "hospitalReason",

  // Section C: Symptom Checklist (Past 2 Weeks)
  "Feeling down, depressed, or hopeless",
  "Little interest or pleasure in doing things",
  "Feeling nervous, anxious, or on edge",
  "Trouble relaxing",
  "Excessive worry",
  "Fatigue or low energy",
  "Changes in appetite",
  "Sleep disturbances",
  "Difficulty concentrating",
  "Thoughts of self-harm or suicide",

  // Section D: Behavioral Patterns
  "dailyFunction",
  "substanceUse",
  "substanceDetails",
  "lifeChanges",
  "changeDetails",

  // Section E: Social & Emotional Well-being
  "connectedness",
  "safety",
  "safetyDetails",
  "hobbies",
  "copingStrategies"
];


  const emptyField = requiredFields.find(
    (field) => !form[field] || (typeof form[field] === "string" && form[field].trim() === "")
  );

  if (emptyField) {
    toast.error(`Please fill all fields before submitting. Missing: "${emptyField}"`);
    setIsSubmitted(flase);
    return;
  }

  else{
setIsSubmitted(true);
    
    try {
      const truncate = (str, maxLen = 25) =>
        typeof str === "string" ? (str.length > maxLen ? str.slice(0, maxLen) : str) : "";
      
      const copingStrategies = Array.isArray(form.copingStrategies) ? form.copingStrategies : [];
      
      const cleanedForm = {
        ...form,
        CopingStrategies: copingStrategies,
        "Feeling down, depressed, or hopeless": truncate(form["Feeling down, depressed, or hopeless"]),
        "Little interest or pleasure in doing things": truncate(form["Little interest or pleasure in doing things"]),
        "Feeling nervous, anxious, or on edge": truncate(form["Feeling nervous, anxious, or on edge"]),
        "Trouble relaxing": truncate(form["Trouble relaxing"]),
        "Excessive worry": truncate(form["Excessive worry"]),
        "Fatigue or low energy": truncate(form["Fatigue or low energy"]),
        "Changes in appetite": truncate(form["Changes in appetite"]),
        "Sleep disturbances": truncate(form["Sleep disturbances"]),
      "Difficulty concentrating": truncate(form["Difficulty concentrating"]),
      "Thoughts of self-harm or suicide": truncate(form["Thoughts of self-harm or suicide"]),
      dailyFunction: truncate(form.dailyFunction),
      substanceUse: truncate(form.substanceUse),
      substanceDetails: truncate(form.substanceDetails),
      lifeChanges: truncate(form.lifeChanges),
      changeDetails: truncate(form.changeDetails),
      connectedness: truncate(form.connectedness),

      safety: truncate(form.safety),
      safetyDetails: truncate(form.safetyDetails),
      hobbies: truncate(form.hobbies),
      diagnosed: truncate(form.diagnosed),
      treatment: truncate(form.treatment),
      treatmentType: truncate(form.treatmentType),
      provider: truncate(form.provider),
      hospitalized: truncate(form.hospitalized),
      hospitalReason: truncate(form.hospitalReason),
    };
    
    const geminiScoreRaw = await getScore(JSON.stringify(form));
    const geminiScore = geminiScoreRaw.totalScore;
    setinterpretation(geminiScoreRaw.interpretation)
    console.log("gemini",geminiScore)
    setScore(geminiScore);
    console.log("StoreScore",score)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    // Save to Questionnaire collection
    const getquestionare = await db.Questionare.list([Query.equal("userid",userID)])
    if(getquestionare.documents.length === 0){
      
      const questionareResponse = await db.Questionare.create({
        userid:userID,
        FullName: cleanedForm["Full Name"],
        FamilyType:form.FamilyType,
        Age: form.Age,
        Sex: form.Sex,
        FamilyMember:form.FamilyMember,
        DateOfAssessment: cleanedForm["Date of Assessment"],
        ContactInformation: cleanedForm["Contact Information"],
        EmergencyContact: cleanedForm["Emergency Contact"],
        OccupationSchool: form.Occupation,
        Diagnosed: cleanedForm.diagnosed,
        Treatment: cleanedForm.treatment,
        TreatmentType: cleanedForm.treatmentType,
        Provider: cleanedForm.provider,
        Hospitalized: cleanedForm.hospitalized,
        HospitalReason: cleanedForm.hospitalReason,
        FeelingDownDepressedOrHopeless: cleanedForm["Feeling down, depressed, or hopeless"],
        LittleInterestOrPleasureInThings: cleanedForm["Little interest or pleasure in doing things"],
        FeelingNervousAnxiousOrOnEdge: cleanedForm["Feeling nervous, anxious, or on edge"],
        TroubleRelaxing: cleanedForm["Trouble relaxing"],
        ExcessiveWorry: cleanedForm["Excessive worry"],
        FatigueorLowEnergy: cleanedForm["Fatigue or low energy"],
        ChangeInAppetite: cleanedForm["Changes in appetite"],
        SleepDisturbance: cleanedForm["Sleep disturbances"],
        DifficultyConcentrating: cleanedForm["Difficulty concentrating"],
        ThoughtsOfSelfHarmOrSuicide: cleanedForm["Thoughts of self-harm or suicide"],
        DailyFunction: cleanedForm.dailyFunction,
        SubstanceUse: cleanedForm.substanceUse,
      SubstanceDetails: cleanedForm.substanceDetails,
      LifeChanged: cleanedForm.lifeChanges,
      ChangeDetails: cleanedForm.changeDetails,
      Connectedness: cleanedForm.connectedness,
      Safety: cleanedForm.safety,
      SafetyDetails: cleanedForm.safetyDetails,
      Hobbies: cleanedForm.hobbies,
      CopingStrategies: cleanedForm.CopingStrategies,
    }).then(async()=>{
      const attributesResponse = await db.UsersAttributes.create({
        UserId:userID,
        Score:geminiScore,
        lastUpdatedDate:formattedDate,
        NumberOfTimesFilled:1
      })
    })
  }
  else{
    // console.log(getquestionare.documents[0].$id)
    const updateQuestionareResponse = await db.Questionare.update(getquestionare.documents[0].$id,{
        userid:userID,
        FullName: cleanedForm["Full Name"],
        FamilyType:form.FamilyType,
        Age: form.Age,
        Sex: form.Sex,
        FamilyMember:form.FamilyMember,
        DateOfAssessment: cleanedForm["Date of Assessment"],
        ContactInformation: cleanedForm["Contact Information"],
        EmergencyContact: cleanedForm["Emergency Contact"],
        OccupationSchool: form.Occupation,
        Diagnosed: cleanedForm.diagnosed,
        Treatment: cleanedForm.treatment,
        TreatmentType: cleanedForm.treatmentType,
        Provider: cleanedForm.provider,
        Hospitalized: cleanedForm.hospitalized,
        HospitalReason: cleanedForm.hospitalReason,
        FeelingDownDepressedOrHopeless: cleanedForm["Feeling down, depressed, or hopeless"],
        LittleInterestOrPleasureInThings: cleanedForm["Little interest or pleasure in doing things"],
        FeelingNervousAnxiousOrOnEdge: cleanedForm["Feeling nervous, anxious, or on edge"],
        TroubleRelaxing: cleanedForm["Trouble relaxing"],
        ExcessiveWorry: cleanedForm["Excessive worry"],
        FatigueorLowEnergy: cleanedForm["Fatigue or low energy"],
        ChangeInAppetite: cleanedForm["Changes in appetite"],
        SleepDisturbance: cleanedForm["Sleep disturbances"],
        DifficultyConcentrating: cleanedForm["Difficulty concentrating"],
        ThoughtsOfSelfHarmOrSuicide: cleanedForm["Thoughts of self-harm or suicide"],
        DailyFunction: cleanedForm.dailyFunction,
        SubstanceUse: cleanedForm.substanceUse,
      SubstanceDetails: cleanedForm.substanceDetails,
      LifeChanged: cleanedForm.lifeChanges,
      ChangeDetails: cleanedForm.changeDetails,
      Connectedness: cleanedForm.connectedness,
      Safety: cleanedForm.safety,
      SafetyDetails: cleanedForm.safetyDetails,
      Hobbies: cleanedForm.hobbies,
      CopingStrategies: cleanedForm.CopingStrategies,
      }).then(async()=>{
      const targetattributesResponse = await db.UsersAttributes.list([Query.equal("UserId",userID)])
      if(targetattributesResponse.documents.length > 0){


        const targetDocument = targetattributesResponse.documents[0].$id
        const oldScore = targetattributesResponse.documents[0].Score
        const timesFilled = targetattributesResponse.documents[0].NumberOfTimesFilled
          const newScoreValue = Math.max(0, Math.min(50, parseInt(oldScore - geminiScore )));

        const updateattributesResponse = await db.UsersAttributes.update(targetDocument,{
          Score:parseInt(oldScore),
          newScore: newScoreValue,
          lastUpdatedDate:formattedDate,
          NumberOfTimesFilled:parseInt(timesFilled)+1
        })
        // console.log(updateattributesResponse.documents)
      }
      
    })
  }
  
  // Get score from Gemini
  
  // Update or create user attributes
  
  
  toast.success("Form submitted successfully!");
  setTimeout(() => navigate("/dashboard"), 2000);
} catch (error) {
  console.error("Submission error:", error);
  toast.error("Error submitting form. Please try again.");
}
}
};



const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (type === 'checkbox') {
    setForm((prev) => {
      const strategies = prev.copingStrategies || [];
      if (checked) {
        return { ...prev, copingStrategies: [...strategies, value] };
      } else {
        return {
          ...prev,
          copingStrategies: strategies.filter((v) => v !== value),
        };
      }
    });
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};
  

// const newfunction = async()=>{

//   const targetattributesResponse = await db.UsersAttributes.list([Query.equal("UserId",userID)])
//   if(targetattributesResponse.documents.length > 0){
    
    
//     const targetDocument = targetattributesResponse.documents[0].$id
//     const oldScore = targetattributesResponse.documents[0].Score
//     const timesFilled = targetattributesResponse.documents[0].NumberOfTimesFilled
//     const updateattributesResponse = await db.UsersAttributes.update(targetDocument,{
//       Score:oldScore,
//       // newScore:geminiScore-oldScore >= 0?score-oldScore:0,
//       // lastUpdatedDate:formattedDate,
//       NumberOfTimesFilled:timesFilled+1
//     })
//     // console.log("document id",targetDocument)
//     console.log("Updated Document",updateattributesResponse)
//   }
// // }
// useEffect(() => {

//   console.log(userID)
// }, [])
  return (
    <>

    <Navbar/>
     <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-quicksand text-gray-900">
      <AnimatePresence>
        {!isSubmitted ? (
          <motion.form
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-300"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={fadeIn}
            onSubmit={handleSubmit}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-blue-700 mb-4">
                <BookOpen className="inline-block mr-2 w-8 h-8" />
                MoodMigo Mental Health Questionnaire
              </h1>
              <p className="text-gray-800">
                Please answer the following questions to access you mental health.
              </p>
            </div>

            {/* Section A: General Info */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Smile className="mr-2 w-5 h-5 text-blue-500" />
                A. General Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Full Name (Optional)",
                  "Age",
                  "Sex",
                  "Date of Assessment",
                  "Contact Information",
                  "Occupation / Education",
                  "Emergency Contact",
                  "FamilyType"
                ].map((label) => (
                  <motion.div key={label} variants={inputVariants} initial="initial" animate="animate">
                    <input
                      type="text"
                      name={label}
                      placeholder={label}
                      value={form[label]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section B: Mental Health History */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="mr-2 w-5 h-5 text-red-600" />
                B. Mental Health History
              </h2>
              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Ever diagnosed with a mental health condition?</label>
                <select
                  name="diagnosed"
                  value={form.diagnosed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              

              
              <motion.div variants={inputVariants} initial="initial" animate="animate" className="mb-4">
                <input
                  type="text"
                  name="FamilyMember"
                  placeholder="Any Family Member Ever diagnosed with a mental health condition Please Fill No is not"
                  value={form.FamilyMember}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  onChange={handleChange}
                />
              </motion.div>
              
              
              
            </section>

            {/* Section C: Symptom Checklist */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="mr-2 w-5 h-5 text-yellow-500" />
                C. Symptom Checklist (Past 2 Weeks)
              </h2>
              {[
                "Feeling down, depressed, or hopeless",
                "Little interest or pleasure in doing things",
                "Feeling nervous, anxious, or on edge",
                "Trouble relaxing",
                "Excessive worry",
                "Fatigue or low energy",
                "Changes in appetite",
                "Sleep disturbances",
                "Difficulty concentrating",
                "Thoughts of self-harm or suicide",
              ].map((symptom, i) => (
                <div key={i} className="mb-4">
                  <label className="block text-gray-900 mb-2">{symptom}</label>
                  <select
                    name={symptom}
                    value={form[symptom]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  >
                    <option value="">Select</option>
                    <option>0 - Not at all</option>
                    <option>1 - Several days</option>
                    <option>2 - More than half the days</option>
                    <option>3 - Nearly every day</option>
                  </select>
                </div>
              ))}
            </section>

            {/* Section D: Behavioral Patterns */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Smile className="mr-2 w-5 h-5 text-green-600" />
                D. Behavioral Patterns
              </h2>
              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Manage daily responsibilities:</label>
                <select
                  name="dailyFunction"
                  value={form.dailyFunction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Substance use frequency:</label>
                <select
                  name="substanceUse"
                  value={form.substanceUse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Never</option>
                  <option>Occasionally</option>
                  <option>Frequently</option>
                  <option>Daily</option>
                </select>
              </div>
              <motion.div variants={inputVariants} initial="initial" animate="animate" className="mb-4">
                <input
                  type="text"
                  name="substanceDetails"
                  placeholder="What substances and how often?"
                  value={form.substanceDetails}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  onChange={handleChange}
                />
              </motion.div>

              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Major life changes recently?</label>
                <select
                  name="lifeChanges"
                  value={form.lifeChanges}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <motion.div variants={inputVariants} initial="initial" animate="animate" className="mb-4">
                <input
                  type="text"
                  name="changeDetails"
                  placeholder="If yes, briefly describe"
                  value={form.changeDetails}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  onChange={handleChange}
                />
              </motion.div>
            </section>

            {/* Section E: Social & Emotional Well-being */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="mr-2 w-5 h-5 text-pink-600" />
                E. Social and Emotional Well-being
              </h2>
              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Feel connected to family/friends?</label>
                <select
                  name="connectedness"
                  value={form.connectedness}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Very connected</option>
                  <option>Somewhat connected</option>
                  <option>Isolated</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Do you feel safe at home/community?</label>
                <select
                  name="safety"
                  value={form.safety}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <motion.div variants={inputVariants} initial="initial" animate="animate" className="mb-4">
                <input
                  type="text"
                  name="safetyDetails"
                  placeholder="If no, explain"
                  value={form.safetyDetails}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  onChange={handleChange}
                />
              </motion.div>

              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Able to enjoy hobbies?</label>
                <select
                  name="hobbies"
                  value={form.hobbies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>Occasionally</option>
                  <option>No</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Coping strategies:</label>
                <div className="flex flex-wrap gap-4">
                  {["Exercise", "Talking to someone", "Hobbies", "Avoidance", "Substance use", "Other"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-gray-900">
                      <input
                        type="checkbox"
                        name="copingStrategies"
                        value={opt}
                        checked={form.copingStrategies.includes(opt)}
                        onChange={handleChange}
                        className="mr-1 rounded-md text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </motion.form>
        ) : (
          <motion.div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-800 mb-6">Your responses have been submitted successfully.</p>
            <br/>
            <p className="text-gray-800 mb-6">{interpretation}</p>

            
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-quicksand {
          font-family: 'Quicksand', sans-serif;
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </div>
    </>
  );
};

export default MoodMigoQuestionnaire;
