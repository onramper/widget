import { BASE_API } from "../../../constants";

const firstStep = {
	type: "form",
	humanName: "Your Details",
	url: `${BASE_API}/transaction/TestGateway/email/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
	title: "Your details",
	useHeading: true,
	data: [
		{
			type: "string",
			name: "cryptocurrencyAddress",
			humanName: "Cryptocurrency wallet address",
			placeholder: "e.g 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
		},
		{
			type: "string",
			name: "fullname",
			humanName: "Full name",
			placeholder: "e.g JohnDoe",
		},
		{
			type: "integer",
			name: "phoneCountryCode",
			humanName: "Phone country code",
		},
		{
			type: "integer",
			name: "phoneNumber",
			humanName: "Phone number",
			placeholder: "654 56 84 56",
		},
	],
};

const emailStep = {
	type: "redirect",
	url: `${BASE_API}/transaction/TestGateway/verifyEmail/key`,
	data: [
		{
			type: "string",
			name: "email",
			humanName: "Email",
			hint: "You can also find the payment info in your email.",
		}
	],
};

const nextStep: {[key:string]: any} = {
	firstStep,
	emailStep
};

const getNextStep = (currentStep: string) => {
	return nextStep?.[currentStep];
};

export default {
	getNextStep
};
