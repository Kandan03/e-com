import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center my-20">
      <SignIn />
    </div>
  )
}