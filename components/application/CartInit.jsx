"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartFromServer } from "@/redux/features/cartSlice";

const CartInit = () => {
	const dispatch = useDispatch();
	const token = useSelector((store) => store.auth?.token);
	const user = useSelector((store) => store.auth?.user);

	useEffect(() => {
		if (token && user && user.role === "user") {
			dispatch(fetchCartFromServer());
		}
	}, [token, user, dispatch]);

	return null;
};

export default CartInit;
