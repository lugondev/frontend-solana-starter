'use client';

import { useGovernance } from '@/lib/hooks/use-governance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export function Governance() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    initializeUpgradeAuthority,
    createUpgradeProposal,
    castVote,
    executeProposal,
    cancelProposal,
    acceptUpgradeAuthority,
  } = useGovernance();

  const [votingThreshold, setVotingThreshold] = useState(51);
  const [votingPeriodDays, setVotingPeriodDays] = useState(7);
  const [executionDelayHours, setExecutionDelayHours] = useState(24);
  const [proposalId, setProposalId] = useState(1);
  const [proposalDescription, setProposalDescription] = useState('');
  const [newProgramData, setNewProgramData] = useState('');
  const [voteProposalId, setVoteProposalId] = useState(1);
  const [votingPower, setVotingPower] = useState(1);
  const [inFavor, setInFavor] = useState(true);

  if (!publicKey) {
    return (
      <Card title="Governance System">
        <p className="text-gray-600">Connect your wallet to participate in governance</p>
      </Card>
    );
  }

  return (
    <Card title="Governance System">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Governance Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Initialize upgrade authority with voting parameters</li>
            <li>• Create upgrade proposals for program changes</li>
            <li>• Cast votes on active proposals</li>
            <li>• Execute approved proposals</li>
            <li>• Cancel proposals (admin only)</li>
            <li>• Transfer upgrade authority</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Initialize Upgrade Authority</h3>
          <input
            type="number"
            placeholder="Voting Threshold (%)"
            value={votingThreshold}
            onChange={(e) => setVotingThreshold(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Voting Period (days)"
            value={votingPeriodDays}
            onChange={(e) => setVotingPeriodDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Execution Delay (hours)"
            value={executionDelayHours}
            onChange={(e) => setExecutionDelayHours(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const votingPeriodSeconds = votingPeriodDays * 24 * 60 * 60;
                const executionDelaySeconds = executionDelayHours * 60 * 60;
                const result = await initializeUpgradeAuthority(
                  votingThreshold,
                  votingPeriodSeconds,
                  executionDelaySeconds
                );
                console.log('Upgrade authority initialized:', result);
                alert('Upgrade authority initialized! PDA: ' + result.upgradeAuthority.toBase58());
              } catch (err) {
                console.error('Initialize failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Initialize Upgrade Authority
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Create Upgrade Proposal</h3>
          <input
            type="number"
            placeholder="Proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Proposal Description"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
          />
          <input
            type="text"
            placeholder="New Program Data Address"
            value={newProgramData}
            onChange={(e) => setNewProgramData(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const result = await createUpgradeProposal(
                  proposalId,
                  proposalDescription,
                  new PublicKey(newProgramData)
                );
                console.log('Proposal created:', result);
                alert('Proposal created! PDA: ' + result.proposal.toBase58());
              } catch (err) {
                console.error('Create proposal failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Create Proposal
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Cast Vote</h3>
          <input
            type="number"
            placeholder="Proposal ID"
            value={voteProposalId}
            onChange={(e) => setVoteProposalId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Voting Power"
            value={votingPower}
            onChange={(e) => setVotingPower(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={inFavor}
                onChange={() => setInFavor(true)}
              />
              <span>In Favor</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!inFavor}
                onChange={() => setInFavor(false)}
              />
              <span>Against</span>
            </label>
          </div>
          <Button
            onClick={async () => {
              try {
                const tx = await castVote(voteProposalId, inFavor, votingPower);
                console.log('Vote cast:', tx);
                alert('Vote cast successfully! Tx: ' + tx);
              } catch (err) {
                console.error('Cast vote failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Cast Vote
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Cancel Proposal</h3>
          <input
            type="number"
            placeholder="Proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const tx = await cancelProposal(proposalId);
                console.log('Proposal cancelled:', tx);
                alert('Proposal cancelled! Tx: ' + tx);
              } catch (err) {
                console.error('Cancel proposal failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Cancel Proposal
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Accept Upgrade Authority</h3>
          <p className="text-sm text-gray-600">
            Accept transfer of upgrade authority to your wallet
          </p>
          <Button
            onClick={async () => {
              try {
                const tx = await acceptUpgradeAuthority();
                console.log('Authority accepted:', tx);
                alert('Upgrade authority accepted! Tx: ' + tx);
              } catch (err) {
                console.error('Accept authority failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Accept Upgrade Authority
          </Button>
        </div>
      </div>
    </Card>
  );
}
