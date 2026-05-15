import * as React from "react";

// Điểm ngắt mobile
const MOBILE_BREAKPOINT = 768;

const getIsMobile = () => {
	if (typeof window === "undefined") {
		return false;
	}

	return window.innerWidth < MOBILE_BREAKPOINT;
};

// Hook phát hiện thiết bị mobile
export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(getIsMobile);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = (event) => {
			setIsMobile(event.matches);
		};
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return isMobile;
}
