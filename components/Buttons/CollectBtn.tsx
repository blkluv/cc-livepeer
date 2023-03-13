import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { Button, Spacer, Loading } from "@nextui-org/react";

import toast from "react-hot-toast";
function CollectBtn({
	profileID,
	essenceID,
	isCollectedByMe,
	collectMw,
}: {
	profileID: number;
	essenceID: number;
	isCollectedByMe: boolean;
	collectMw: Record<string, any>;
}) {
	const { accessToken, connectWallet, checkNetwork } = useContext(AuthContext);
	const [createCollectEssenceTypedData] = useMutation(
		CREATE_COLLECT_ESSENCE_TYPED_DATA
	);
	const [relay] = useMutation(RELAY);
	const [stateCollect, setStateCollect] = useState(isCollectedByMe);
	const [loading, setLoading] = useState(false);

	const handleOnClick = async () => {
		try {
			/* Check if the user logged in */
			if (!accessToken) {
				throw Error("You need to Sign in.");
			}
			setLoading(true);
			/* Connect wallet and get provider */
			const provider = await connectWallet();

			/* Check if the network is the correct one */
			await checkNetwork(provider);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			/* Get the address from the provider */
			const address = await signer.getAddress();

			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Create typed data in a readable format */
			const typedDataResult = await createCollectEssenceTypedData({
				variables: {
					input: {
						collector: address,
						profileID: profileID,
						essenceID: essenceID,
					},
				},
			});

			const typedData =
				typedDataResult.data?.createCollectEssenceTypedData?.typedData;
			const message = typedData.data;
			const typedDataID = typedData.id;

			/* Get the signature for the message signed with the wallet */
			const params = [address, message];
			const method = "eth_signTypedData_v4";
			const signature = await signer.provider.send(method, params);

			/* Call the relay to broadcast the transaction */
			const relayResult = await relay({
				variables: {
					input: {
						typedDataID: typedDataID,
						signature: signature,
					},
				},
			});
			const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

			/* Log the transation hash */
			console.log("~~ Tx hash ~~");
			console.log(txHash);

			/* Set the state to true */
			setStateCollect(true);
			setLoading(false);

			/* Display success message */
			toast.success("Post was collected!");
		} catch (error) {
			/* Display error message */
			const message = error.message as string;
			toast.error(message)
			
		}
	};

	return (
		<Button
			// className="collect-btn"
			onClick={handleOnClick}
			disabled={stateCollect}
			auto
		>
			{loading ? <Loading color="currentColor" size="sm" /> : stateCollect ? "Collected" : "Collect"}
		</Button>
	);
}

export default CollectBtn;
