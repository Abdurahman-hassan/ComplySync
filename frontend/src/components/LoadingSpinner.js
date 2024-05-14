import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = () => {
    return (
        <div className='loading-spinner'>
            <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#007bff"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
}

export default LoadingSpinner;