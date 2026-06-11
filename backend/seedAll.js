import dotenv from "dotenv"
import mongoose from "mongoose"
import LegalAid from "./models/LegalAid.js"
import ChildSafety from "./models/ChildSafety.js"
import PoliceDirectory from "./models/PoliceDirectory.js"
dotenv.config()

const legalAidData = [
  { name: "Delhi State Legal Services Authority", state: "Delhi", city: "New Delhi", category: "general", services: ["free legal aid","court representation","legal advice","mediation"], phone: "011-23385368", email: "dslsa@nic.in", website: "https://dslsa.org", operatingHours: "Mon-Sat 10AM-5PM", eligibility: "Women, SC/ST, economically weaker sections", isVerified: true, isFree: true },
  { name: "Sakshi Violence Intervention Centre", state: "Delhi", city: "New Delhi", category: "domestic violence", services: ["legal counselling","court support","documentation","shelter referral"], phone: "011-26853846", email: "info@sakshi.org", website: "https://sakshi.org", operatingHours: "Mon-Sat 9AM-6PM", eligibility: "Women survivors of violence", isVerified: true, isFree: true },
  { name: "Majlis Legal Centre", state: "Maharashtra", city: "Mumbai", category: "domestic violence", services: ["legal representation","FIR assistance","court advocacy","documentation"], phone: "022-23771213", email: "majlis@vsnl.net", website: "https://majlislaw.com", operatingHours: "Mon-Fri 10AM-6PM", eligibility: "Women and children facing legal issues", isVerified: true, isFree: true },
  { name: "iCall Legal Support", state: "Maharashtra", city: "Mumbai", category: "workplace harassment", services: ["POSH Act guidance","legal counselling","complaint assistance"], phone: "9152987821", email: "icall@tiss.edu", website: "https://icallhelpline.org", operatingHours: "Mon-Sat 8AM-10PM", eligibility: "Women facing workplace harassment", isVerified: true, isFree: true },
  { name: "Swayam Legal Cell", state: "West Bengal", city: "Kolkata", category: "family law", services: ["divorce proceedings","custody battles","maintenance claims","legal advice"], phone: "033-24556073", email: "info@swayam.info", website: "https://swayam.info", operatingHours: "Mon-Sat 10AM-5PM", eligibility: "Women in need of family law support", isVerified: true, isFree: true },
  { name: "Cyber Crime Cell Support", state: "Karnataka", city: "Bangalore", category: "cyber crime", services: ["cyber stalking","online harassment","revenge porn","digital abuse support"], phone: "1930", email: "cybercrime@ksp.gov.in", website: "https://cybercrime.gov.in", operatingHours: "24/7", eligibility: "All victims of cyber crime", isVerified: true, isFree: true },
  { name: "Tamil Nadu State Legal Services", state: "Tamil Nadu", city: "Chennai", category: "general", services: ["legal aid","lok adalat","mediation","legal literacy"], phone: "044-25361180", email: "tnslsa@gmail.com", website: "https://tnslsa.in", operatingHours: "Mon-Fri 10AM-5PM", eligibility: "Women and underprivileged sections", isVerified: true, isFree: true },
  { name: "Prerana Anti Trafficking Legal Aid", state: "Maharashtra", city: "Mumbai", category: "child protection", services: ["trafficking rescue","legal representation","rehabilitation","FIR filing"], phone: "022-22081026", email: "info@preranaantitrafficking.org", website: "https://preranaantitrafficking.org", operatingHours: "Mon-Sat 9AM-6PM", eligibility: "Trafficking survivors, women and children", isVerified: true, isFree: true },
  { name: "Human Rights Law Network", state: "Delhi", city: "New Delhi", category: "general", services: ["PILs","human rights violations","custodial violence","sexual violence"], phone: "011-24374501", email: "hrln@hrln.org", website: "https://hrln.org", operatingHours: "Mon-Fri 10AM-5PM", eligibility: "All marginalized groups", isVerified: true, isFree: true },
  { name: "Kerala Legal Services Authority", state: "Kerala", city: "Ernakulam", category: "family law", services: ["matrimonial disputes","maintenance","property rights","domestic violence"], phone: "0484-2394090", email: "kelsa@nic.in", website: "https://kelsa.nic.in", operatingHours: "Mon-Sat 10AM-5PM", eligibility: "Women in Kerala", isVerified: true, isFree: true },
]

const childSafetyData = [
  { name: "Childline India Foundation", type: "helpline", services: ["emergency rescue","child abuse reporting","missing children","child counselling"], phone: "1098", emergencyPhone: "1098", email: "info@childlineindia.org.in", website: "https://childlineindia.org.in", description: "India's first 24-hour free emergency phone outreach service for children in need of care and protection.", isVerified: true, isNational: true },
  { name: "NCPCR — National Commission for Protection of Child Rights", type: "government", services: ["child rights protection","complaint resolution","policy oversight","rehabilitation"], phone: "011-23724031", emergencyPhone: "1800-121-2830", email: "ncpcr@nic.in", website: "https://ncpcr.gov.in", description: "National statutory body that monitors and enforces children's rights under the Constitution of India and laws of the land.", isVerified: true, isNational: true },
  { name: "CRY — Child Rights and You", type: "ngo", state: "Delhi", city: "New Delhi", services: ["education rights","child labour prevention","girl child support","policy advocacy"], phone: "022-23063647", email: "info@cry.org", website: "https://cry.org", description: "Empowering children to claim their rights through community action and awareness.", isVerified: true, isNational: true },
  { name: "Bachpan Bachao Andolan", type: "ngo", state: "Delhi", city: "New Delhi", services: ["child labour rescue","trafficking prevention","rehabilitation","education support"], phone: "011-43165700", email: "info@bba.org.in", website: "https://bba.org.in", description: "Founded by Nobel Laureate Kailash Satyarthi, works to end child labour and trafficking.", isVerified: true, isNational: true },
  { name: "Missing Child India", type: "missing child", services: ["missing child alerts","database search","family reunification","police coordination"], phone: "1094", emergencyPhone: "1094", email: "trackthemissingchild@gmail.com", website: "https://trackthemissingchild.gov.in", description: "National tracking system for missing children maintained by Ministry of Home Affairs.", isVerified: true, isNational: true },
  { name: "SOS Children's Villages India", type: "shelter", state: "Delhi", city: "New Delhi", services: ["long term care","education","family strengthening","emergency shelter"], phone: "011-41012158", email: "info@soschildrensvillages.in", website: "https://soschildrensvillages.in", description: "Provides family-based care for children without parental care.", isVerified: true, isNational: true },
  { name: "TULIR — Centre for Prevention of Child Sexual Abuse", type: "rehabilitation", state: "Tamil Nadu", city: "Chennai", services: ["CSA prevention","therapy","awareness training","school programs"], phone: "044-24541673", email: "info@tulir.org", website: "https://tulir.org", description: "Specialized center working exclusively on prevention and healing of child sexual abuse.", isVerified: true },
  { name: "Smile Foundation", type: "ngo", state: "Delhi", city: "New Delhi", services: ["education","healthcare","girl child empowerment","livelihood"], phone: "011-43123700", email: "info@smilefoundationindia.org", website: "https://smilefoundationindia.org", description: "Working directly with underprivileged children and youth through community-based programs.", isVerified: true, isNational: true },
]

const policeData = [
  { state: "Andhra Pradesh", department: "Andhra Pradesh Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://appolice.gov.in", officialEmail: "dgp@appolice.gov.in" },
  { state: "Arunachal Pradesh", department: "Arunachal Pradesh Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://arunachalpradesh.gov.in/police", officialEmail: "dgp-arunpol@nic.in" },
  { state: "Assam", department: "Assam Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://assampolice.gov.in", officialEmail: "dgpassam@nic.in" },
  { state: "Bihar", department: "Bihar Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://biharpolice.bih.nic.in", officialEmail: "dgpbih@nic.in" },
  { state: "Chhattisgarh", department: "Chhattisgarh Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://cgpolice.gov.in", officialEmail: "dgp.cgpolice@gov.in" },
  { state: "Delhi", department: "Delhi Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://delhipolice.gov.in", officialEmail: "cp@delhipolice.gov.in" },
  { state: "Goa", department: "Goa Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://goapolice.gov.in", officialEmail: "dgpgoa@nic.in" },
  { state: "Gujarat", department: "Gujarat Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://gujaratpolice.gov.in", officialEmail: "dgp@gujaratpolice.gov.in" },
  { state: "Haryana", department: "Haryana Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://haryanapolice.gov.in", officialEmail: "dgphryana@hry.nic.in" },
  { state: "Himachal Pradesh", department: "Himachal Pradesh Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://hppolice.gov.in", officialEmail: "dgp@hppolice.gov.in" },
  { state: "Jharkhand", department: "Jharkhand Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://jhpolice.gov.in", officialEmail: "dgp-jhr@nic.in" },
  { state: "Karnataka", department: "Karnataka State Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://ksp.gov.in", officialEmail: "dgp@ksp.gov.in" },
  { state: "Kerala", department: "Kerala Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://keralapolice.gov.in", officialEmail: "dgp@keralapolice.gov.in" },
  { state: "Madhya Pradesh", department: "Madhya Pradesh Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://mppolice.gov.in", officialEmail: "dgp@mppolice.gov.in" },
  { state: "Maharashtra", department: "Maharashtra Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://mahapolice.gov.in", officialEmail: "dgp@mahapolice.gov.in" },
  { state: "Manipur", department: "Manipur Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://manipurpolice.gov.in", officialEmail: "dgpmanipol@nic.in" },
  { state: "Meghalaya", department: "Meghalaya Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://megpolice.gov.in", officialEmail: "dgpmeg@nic.in" },
  { state: "Mizoram", department: "Mizoram Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://mizorampolice.nic.in", officialEmail: "dgpmiz@nic.in" },
  { state: "Nagaland", department: "Nagaland Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://nagalandpolice.gov.in", officialEmail: "dgpngl@nic.in" },
  { state: "Odisha", department: "Odisha Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://odishapolice.gov.in", officialEmail: "dgpodisha@nic.in" },
  { state: "Punjab", department: "Punjab Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://punjabpolice.gov.in", officialEmail: "dgp@punjabpolice.gov.in" },
  { state: "Rajasthan", department: "Rajasthan Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://police.rajasthan.gov.in", officialEmail: "dgp@rajpolice.gov.in" },
  { state: "Sikkim", department: "Sikkim Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://sikkimpolice.nic.in", officialEmail: "dgpsikkim@nic.in" },
  { state: "Tamil Nadu", department: "Tamil Nadu Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://tnpolice.gov.in", officialEmail: "dgp@tnpolice.gov.in" },
  { state: "Telangana", department: "Telangana Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://tspolice.gov.in", officialEmail: "dgp@tspolice.gov.in" },
  { state: "Tripura", department: "Tripura Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://tripurapolice.gov.in", officialEmail: "dgptripura@nic.in" },
  { state: "Uttar Pradesh", department: "Uttar Pradesh Police", emergencyNumber: "100", womenHelpline: "1090", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://uppolice.gov.in", officialEmail: "dgp@up.nic.in" },
  { state: "Uttarakhand", department: "Uttarakhand Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://uttarakhandpolice.uk.gov.in", officialEmail: "dgpuk@nic.in" },
  { state: "West Bengal", department: "West Bengal Police", emergencyNumber: "100", womenHelpline: "1091", cyberCrimePortal: "https://cybercrime.gov.in", cyberCrimePhone: "1930", officialWebsite: "https://wbpolice.gov.in", officialEmail: "dgp@wbpolice.gov.in" },
]

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    await LegalAid.deleteMany({})
    await LegalAid.insertMany(legalAidData)
    console.log(`Seeded ${legalAidData.length} legal aid entries`)

    await ChildSafety.deleteMany({})
    await ChildSafety.insertMany(childSafetyData)
    console.log(`Seeded ${childSafetyData.length} child safety entries`)

    await PoliceDirectory.deleteMany({})
    await PoliceDirectory.insertMany(policeData)
    console.log(`Seeded ${policeData.length} police directory entries`)

    await mongoose.disconnect()
    console.log("All data seeded successfully")
    process.exit(0)
  } catch (e) {
    console.error("Seed error:", e.message)
    process.exit(1)
  }
}

seedAll()