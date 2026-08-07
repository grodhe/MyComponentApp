// Translates common Postgres error codes into friendlier HTTP errors.
//
// Usage: catch (err) { throw translatePgError(err); }
// Or, with a more specific message for the situation:
//   catch (err) { throw translatePgError(err, { referenceMessage: "..." }); }
//
// 23505 = unique_violation      (e.g. this project already has that component/
//                                 document name/repository name/task title)
// 23503 = foreign_key_violation (either: the row you're inserting/updating
//                                 points at something that doesn't exist, OR
//                                 you're deleting a row that's still
//                                 referenced elsewhere and protected by
//                                 ON DELETE RESTRICT)
function translatePgError(err, { duplicateMessage, referenceMessage } = {}) {

    // Real Postgres always sets err.code (SQLSTATE) for these, but some
    // test/mock drivers don't populate it, so fall back to sniffing the
    // message for the constraint-violation wording it always includes.
    const isUnique = err.code === "23505"
        || /duplicate key value/i.test(err.message || "");
    const isForeignKey = err.code === "23503"
        || /violates foreign key constraint/i.test(err.message || "");

    if (isUnique) {

        err.status = 409;
        err.message = duplicateMessage || "A record with that value already exists.";

    } else if (isForeignKey) {

        err.status = 409;
        err.message = referenceMessage || "This record is still referenced elsewhere, so the operation can't be completed.";

    }

    return err;

}

module.exports = {
    translatePgError
};
