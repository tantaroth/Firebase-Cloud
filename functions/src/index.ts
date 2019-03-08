import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

const bucket = admin.storage().bucket("gs://ng-lab.appspot.com");

export const triggers = functions.firestore.document("triggers/{triggerId}").onCreate(snap => {
  const data = snap.data();

  if (data) {
    const pathLog = `upload/${data.uuid}/${data.uuid}.log`;

    bucket.file(pathLog).save(
      Buffer.from(JSON.stringify(data)),
      {
        metadata: { contentType: "text/html" }
      },
      error => {
        if (error) {
          return;
        }

        data.output = pathLog;

        const afs = admin.firestore();
        afs
          .doc("triggers/" + data.uuid)
          .set(data)
          .then(() => console.log("Good!"))
          .catch(console.error);
      }
    );
  }
});
