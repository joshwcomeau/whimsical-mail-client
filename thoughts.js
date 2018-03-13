<ComposeEmailState>
  <NodeConsumer>
    {({ compose, outbox }) => (
      <ChildTraveller
        direction={step === "opening" ? "from" : "to"}
        target={
          if (step === opening) { 
            return compose;
          } else if (step === closing) {
            return outbox;
          } else {
            return null;
          }
        }
      >
        <FoldableLetter
          isFolded={ComposeEmailState.step === 'sending'}
          front={<ComposeEmail {...state} {...actions} />}
          back={<ComposeEmailEnveloppe />}
        />
      </ChildTraveller>

      <ModalBackdrop isVisible={step !== 'closing' || step !== 'closed'} />
    )}
  </NodeConsumer>
</ComposeEmailState>


ComposeEmailState = {
  // State
  step: 'opening' | 'open' | 'folding' | 'closing' | 'closed',
  actionType: 'send' | 'save' | 'delete',

  // Actions
  sendEmail: () => any,
  saveDraft: () => any,
  deleteDraft: () => any,
};

By default: ComposeEmailState.step is `closed`.

