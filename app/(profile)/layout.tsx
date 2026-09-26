import { ReactNode } from "react"
import { Profile } from "@/components/Profile"

const ProfileLayout = ({ children }: { children: ReactNode }) => (
  <div className="profile-layout">
    <Profile />
    <div className="profile-main">{children}</div>
  </div>
)
export default ProfileLayout
