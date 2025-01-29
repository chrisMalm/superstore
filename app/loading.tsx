import Image from 'next/image'
import Loader from '@/assets/loader.gif'
const LoadingPage = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Image src={Loader} height={150} width={150} alt="loading..." />
        </div>
    )
}

export default LoadingPage
