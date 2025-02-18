import { Link } from "react-router-dom";

interface Props {}

const Hero = (_props: Props) => {
	return (
		<section
			id="hero"
			className="h-screen w-full bg-gradient-to-r from-indigo-950 via-teal-250 to-purple-800 flex items-center"
		>
			<div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-8 lg:px-28 h-full mb-32">
				<div className="flex flex-col space-y-10 lg:w-1/2 h-full align-middle justify-center text-center lg:text-left">
					<h1 className="text-3xl lg:text-5xl font-extrabold text-purple-300 text-wrap leading-tight">
						My TODO List
					</h1>
					<p className="text-lg lg:text-xl text-white">
						Organize your tasks based on locations and stay productive with ease
					</p>
					<div className="mx-auto lg:mx-0">
						<Link
							to="/login"
							className="py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600  rounded-lg hover:shadow-xl transition-shadow duration-300 shadow-md"
						>
							Get Started
						</Link>
					</div>
				</div>
				<div className="lg:w-1/2 flex justify-center lg:justify-end hover:animate-bounce duration-1000 ease-in-out">
					<img
						src="/red_placeholder.png" // Replace with your image source
						alt="Placeholder App Image"
						className="w-full max-w-xs py-3"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
