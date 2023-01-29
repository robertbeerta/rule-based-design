import { StatusCode } from './enums/StatusCode';
import { UnprocessableEntityError } from './errors/base/UnprocessableEntityError';
import { Alert } from './alert/Alert';
import { UnfulfilledPrerequesitesError } from './errors/UnfulfilledPrerequesitesError';

describe('An employee of the security office ', () => {
  describe('when alerting the data subject of a security incident', () => {
    it('should be able to trigger an alert when all prerequisites of the alert have been met (Correct rule 15)', async () => {
      const alert = new Alert(correctAlertData, correctPrerequisites, dataSubject)
      const correctAlertResponse: any = alert.send();

      expect(correctAlertResponse.status).toBe(StatusCode.SUCCESS);
    });

    it('should throw an error when an alert is sent without fulfilling the prerequisites (Violation rule 15)', async () => {
      const incorrectPrerequisitesAlert = new Alert(correctAlertData, incorrectPrerequisites, dataSubject);
      const incorrectPrerequisiteReponse: any = incorrectPrerequisitesAlert.send();

      expect(incorrectPrerequisiteReponse).rejects.toThrow(
        new UnfulfilledPrerequesitesError()
      );
    });

    it('should throw an error when an alert is sent by an incorrect Sender (Violation rule 15)', async () => {
      const incorrectPrerequisitesAlert = new Alert(correctAlertData, correctPrerequisites, dataSubject);
      const incorrectPrerequisiteReponse: any = incorrectPrerequisitesAlert.send();

      expect(incorrectPrerequisiteReponse).rejects.toThrow(
        new InvalidActionError()
      );
    });

    it('should throw an error when an alert is sent to an incorrect receiver (Violation rule 15)', async () => {
      const incorrectPrerequisitesAlert = new Alert(correctAlertData, correctPrerequisites, incorrectDataSubject);
      const incorrectPrerequisiteReponse: any = incorrectPrerequisitesAlert.send();
      expect(incorrectPrerequisiteReponse).rejects.toThrow(
        new IncorrectReceiverError()
      );
    });

    it('should add all relevant information to the alert message (Correct rule 17)', async () => {
      const alert = new Alert(correctAlertData, correctPrerequisites, dataSubject)
      const correctAlertResponse: any = alert.send();

      expect(correctAlertResponse.status).toBe(StatusCode.SUCCESS);
    });

    it('should throw an error if alert is not provided by the security office (Violation rule 17)', async () => {
      const incorrectSenderAlert: any = alert.send(incorrectSender, correctPrerequisites, dataSubject);
      await expect(incorrectSenderAlert).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it('should throw an error if the recipient of the alert is not the same as the data subject (Violation rule 17)', async () => {
      const incorrectRecipientAlert: any = alert.send(incorrectRecipient, correctPrerequisites, dataSubject);
      await expect(incorrectRecipientAlert).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it('should throw an error if the information provided is incomplete (Violation rule 17)', async () => {
      const incompleteInformationAlert: any = alert.send(missingData, correctPrerequisites, dataSubject);
      await expect(incompleteInformationAlert).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });
  });
});

describe('A data subject', () => {
  describe('when requesting additional information from the security office', () => {
    it ('should receive additional information from the data protection officer (Correct rule 31)', () => {
      const correctInformationRequest: InformationRequest = informationRequest.send(missingData, correctPrerequisites, dataSubject);
      expect(correctRequest.status).toBe(StatusCode.SUCCESS);
    });

    it ('should throw an error when the request for additional information is not sent to the Security Office (Violation rule 31)', () => {
      const incorrectRecipientRequest: InformationRequest = informationRequest.send(correctData, correctPrerequisites, incorrectRecipient);
      expect(informationRequestToWrongRecipient).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it ('should throw an error when the response for additional information does not come from the data protection officer (Violation rule 31)', () => {
      expect(actionWithWrongController).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it ('should only receive additional information about the security breach it was alerted about (Correct rule 31)', () => {
      expect(actionWithWrongController).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it ('should throw an error when requesting information about a breach it was not alerted about (Violation rule 31)', () => {
      expect(actionWithWrongController).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });
  });
});

describe('A data protection officer', () => {
  describe('when receiving a request for additional information', () => {
    it ('should send additional information to correct data subject (Correct rule 31)', () => {
      const correctInformationRequest: InformationRequest = informationRequest.send(missingData, correctPrerequisites, dataSubject);
      expect(correctRequest.status).toBe(StatusCode.SUCCESS);
    });

    it ('should throw an error when the request for additional information does not come through the security office (Violation rule 31)', () => {
      expect(actionWithWrongController).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });

    it ('should throw an error when the additional information is being sent to the incorrect data subject (Violation rule 31)', () => {
      expect(actionWithWrongController).rejects.toThrow(
        new UnprocessableEntityError()
      );
    });
  })
})
