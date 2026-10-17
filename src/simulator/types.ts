export type Platform='microsoft'|'splunk';
export type Verdict='incident'|'false_positive'|'inconclusive'|'signal';
export type Priority='low'|'medium'|'high';
export type Impact='unauthorized_access'|'legitimate'|'unknown'|'exfiltration';
export interface SimEvent {id:string;time:string;availableAt:string;source:string;user:string;ip:string;host:string;code:string;summary:string;fields:Record<string,string>;provenance:string}
export interface ClaimChoice {id:string;label:string}
export interface Scenario {id:string;revision:string;platform:Platform;product:string;level:'N1'|'N2';title:string;context:string;alert:{id:string;severity:Priority;time:string;origin:string;entity:string};objectives:string[];categories:string[];claims:ClaimChoice[];actions:{id:string;label:string}[];competencies:string[];initialSnapshot:string;extendedSnapshot?:string;dataset:{file:string;sha256:string};sources:{file:string;sha256:string}[]}
export interface Filters {user:string;ip:string;host:string;code:string;start:string;end:string;search:string}
export interface Correlation {id:string;claimId:string;stance:'supports'|'limits'|'contradicts';eventIds:string[];reason:string}
export interface Triage {category:string;entity:string;start:string;end:string}
export interface Decision {verdict:Verdict|'';priority:Priority|'';escalate:'yes'|'no'|'';reason:string;actions:string[]}
export interface Report {summary:string;scope:string;indicators:string;impactText:string;recommendations:string;conclusion:string;evidenceIds:string[];indicatorValues:string[];impact:Impact|''}
export interface ScoreDimension {id:string;label:string;points:number;max:number;feedback:string[]}
export interface Evaluation {score:number;passed:boolean;dimensions:ScoreDimension[];penalties:{points:number;reason:string}[];omitted:string[];explanation:string;humanReview:'pending';evaluatedAt:number;rubricVersion:string}
export interface Attempt {id:string;scenarioId:string;revision:string;platform:Platform;competencies:string[];startedAt:number;updatedAt:number;completedAt:number|null;viewed:string[];selected:string[];hypothesis:string;correlations:Correlation[];triage:Triage;decision:Decision;report:Report;filters:Filters;snapshot:string;journal:{at:number;action:string;detail:string}[];evaluation?:Evaluation}
export interface SimulatorStore {schemaVersion:1;platform:Platform;attempts:Record<string,Attempt[]>}
export interface EvidenceRule {ids:string[];minimum:number;points:number;why:string}
export interface ClaimRule {id:string;stance:Correlation['stance'];groups:{ids:string[];minimum:number}[];why:string}
export interface DecisionRule {verdict:Verdict;priorities:Priority[];escalate:Decision['escalate'];requiredClaims:string[];impact:Impact}
export interface Rubric {version:string;category:string;entity:string;start:string;end:string;evidence:EvidenceRule[];useful:string[];claims:ClaimRule[];decisions:DecisionRule[];actions:string[];criticalEvidence:string[];explanation:string}
