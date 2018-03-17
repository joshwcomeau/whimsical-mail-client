<ComposeEmailContainer>
  <NodeConsumer>
    {({ compose, outbox }) => (
      <ChildTransporter
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
      </ChildTransporter>

      <ModalBackdrop isVisible={step !== 'closing' || step !== 'closed'} />
    )}
  </NodeConsumer>
</ComposeEmailContainer>


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

// FLIP Technique time!
// ChildTransporter starts at its FROM position and animates scale.
// When the `target` changes, we transfer its existing position in the viewport
// to an instance property (or state), and once it's updated, we apply the
// inverse transform, add a transition, and let it slide.
