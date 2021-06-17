export const sessionProof = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // TODO: validation
    //   STORE uniq user login on dynamodb if possible
    let user;
    try {
        user = await getUserByLogin({ login: req.body.login });
    } catch (e) {
        return next(createError(403, "[sessionProof][error user not found]"));
    }
    const clientSessionProof = req.body.clientSessionProof;
    const clientEphemeralPublic = req.body.clientEphemeralPublic;
    const login = req.body.login;
    const serverEphemeralSecret = user?.serverEphemeralSecret;
    const salt = user?.salt;
    const verifier = user?.verifier;

    if (user) {
        try {
            const serverSession = srp.deriveSession(
                serverEphemeralSecret,
                clientEphemeralPublic,
                salt,
                login,
                verifier,
                clientSessionProof
            );
            await updateUser_ServerSessionProof({
                address: user.address,
                serverSessionProof: serverSession.proof,
            });
            res.send({ serverSessionProof: serverSession.proof });
        } catch (e) {
            console.warn("[sessionProof]", e);
            res.send({ errorMessage: "Login or password is invalid" });
        }
    }
};