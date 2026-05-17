"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartFromServer } from "@/redux/features/cartSlice";

const CartInit = () => {
	const dispatch = useDispatch();
	const token = useSelector((store) => store.auth?.token);

	useEffect(() => {
		if (token) {
			dispatch(fetchCartFromServer());
		}
	}, [token, dispatch]);

	return null;
};

export default CartInit;
