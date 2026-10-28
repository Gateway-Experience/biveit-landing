import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  ArrowUpIcon, CheckCircle2Icon, CheckIcon, ChevronDownIcon, EyeIcon, FileTextIcon, HouseIcon, Loader2Icon, LockIcon,
  MousePointer2Icon, PlusIcon, SearchIcon,
} from 'lucide-react';
import { cn } from 'cn';

import logo from 'src/assets/brand/biveit-logo.png';
import Reveal from 'src/components/common/Reveal';
import ScaledFrame from 'src/components/common/ScaledFrame';
import { CafeSite } from 'src/components/pages/landing/ExampleSites';
import { BrowserDots } from 'src/components/pages/landing/ProductSnippets';
import { useInterval, useIsInView, useMediaQuery } from 'src/utils/hooks';

// The person in the demo, and the project she's making (the café is the gallery's Morning Bean).
const _DEMO_USER = { firstName: 'Emma', fullName: 'Emma Carter' };
const _DEMO_PROJECT = 'Morning Bean';

// When everything in the demo happens (ms from the start of the loop). Each step's start is where its tab
// jumps to; the clock wraps around after `total`.
const _T = {
  typeFrom: 400, typeTo: 2600, sent: 2800,
  questionTyping: 3200, question: 4100, questionOptions: 4500, questionPointer: 5200, questionPicked: 5900, questionAnswer: 6300,
  planTyping: 6700, plan: 7400, buildOptions: 8000, buildPointer: 8700, buildPicked: 9400,
  build: 9800, building: 10200, previewOpen: 10600,
  tasks: [11000, 12000, 13000, 14000], tasksDone: 15000,
  sketchBanner: 11200, sketchTiles: [12200, 12800, 13400], site: 14400,
  live: 15600, ready: 16400, liveOptions: 16800, livePointer: 17500, livePicked: 18200, liveAnswer: 18500,
  domainFrom: 18900, domainTo: 19900, loading: 20100, published: 20700, liveTag: 21000, liveMessage: 21500,
  total: 26000,
};
// How often the clock ticks. Movement between ticks is CSS transitions, so this only has to be fine enough
// for things to show up on time.
const _TICK_MS = 100;
// The last moments of the loop fade the demo out, so it starts over from a blank chat rather than a jump.
const _FADE_OUT_MS = 500;

const _STEPS = [
  { id: 'talk', titleKey: 'landing_step1_title', descKey: 'landing_step1_body', from: 0, to: _T.build },
  { id: 'build', titleKey: 'landing_step2_title', descKey: 'landing_step2_body', from: _T.build, to: _T.live },
  { id: 'live', titleKey: 'landing_step3_title', descKey: 'landing_step3_body', from: _T.live, to: _T.total },
];

const _TASK_KEYS = ['landing_demo_task_pages', 'landing_demo_task_style', 'landing_demo_task_booking', 'landing_demo_task_test'];
const _RECENT_KEYS = ['landing_demo_recent_yoga', 'landing_demo_recent_wedding'];

const _BUBBLE_CLASS = 'w-fit max-w-[85%] animate-in rounded-2xl px-3.5 py-2 duration-500 fade-in-0 slide-in-from-bottom-2';

// [Pure] The first `progress` (0 to 1) of a text, by characters (so it works for any script).
function _typedPart(text: string, progress: number) {
  const characters = Array.from(text);
  return characters.slice(0, Math.round(_.clamp(progress, 0, 1) * characters.length)).join('');
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return <p className={cn(_BUBBLE_CLASS, 'ml-auto rounded-br-sm bg-highlight')}>{children}</p>;
}

function AgentBubble({ children }: { children: React.ReactNode }) {
  return <div className={cn(_BUBBLE_CLASS, 'rounded-bl-sm bg-muted')}>{children}</div>;
}

// The agent "typing": three bouncing dots in a reply bubble.
function TypingDots() {
  return (
    <span className={cn(_BUBBLE_CLASS, 'flex gap-1 rounded-bl-sm bg-muted py-3')}>
      {[0, 150, 300].map(delayMs => <span key={delayMs} className='size-1.5 animate-bounce rounded-full bg-foreground/40' style={{ animationDelay: `${delayMs}ms` }} />)}
    </span>
  );
}

// Tap-to-answer options under a question. The first one is the pick: the pointer glides onto it at
// `pointerAt` and it fills in at `pickedAt`.
function DemoOptions({ optionKeys, elapsedMs, pointerAt, pickedAt }: { optionKeys: string[]; elapsedMs: number; pointerAt: number; pickedAt: number }) {
  const { t } = useTranslation();
  const isPicked = elapsedMs >= pickedAt;
  return (
    <div className='flex flex-wrap gap-1.5'>
      {optionKeys.map((optionKey, index) => (
        <span
          key={optionKey}
          style={{ animationDelay: `${index * 120}ms` }}
          className={cn(
            'relative animate-in rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 fill-mode-backwards fade-in-0 slide-in-from-bottom-2',
            index === 0 && isPicked ? 'scale-105 border-primary bg-primary text-primary-foreground' : 'bg-card',
          )}
        >
          {t(optionKey)}
          {index === 0 && (
            <MousePointer2Icon
              className={cn(
                'absolute -right-2 -bottom-3 size-4 fill-foreground text-foreground transition-all duration-700 ease-out',
                elapsedMs < pointerAt && 'translate-x-10 translate-y-6 opacity-0',
                isPicked && 'scale-90',
              )}
            />
          )}
        </span>
      ))}
    </div>
  );
}

// The agent at work: its to-do list, each item spinning while it's on it and ticked once done.
function TaskList({ elapsedMs }: { elapsedMs: number }) {
  const { t } = useTranslation();
  const isDone = elapsedMs >= _T.tasksDone;
  return (
    <div className='w-full max-w-[85%] animate-in rounded-2xl border bg-card p-3 duration-500 fade-in-0 slide-in-from-bottom-2'>
      <p className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground'>
        {isDone ? <CheckCircle2Icon className='size-3.5 text-success' /> : <Loader2Icon className='size-3.5 animate-spin' />}
        {t(isDone ? 'landing_demo_done' : 'landing_demo_working')}
      </p>
      <ul className='mt-2 flex flex-col gap-1.5'>
        {_TASK_KEYS.map((taskKey, index) => {
          const startAt = _T.tasks[index] ?? 0;
          const doneAt = _T.tasks[index + 1] ?? _T.tasksDone;
          if (elapsedMs < startAt) {
            return null;
          }
          return (
            <li key={taskKey} className='flex animate-in items-center gap-2 text-xs duration-300 fade-in-0'>
              {elapsedMs >= doneAt
                ? <CheckIcon className='size-3.5 shrink-0 text-success' />
                : <Loader2Icon className='size-3.5 shrink-0 animate-spin text-muted-foreground' />}
              <span className={cn(elapsedMs < doneAt && 'text-muted-foreground')}>{t(taskKey)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// The conversation so far: everything that has happened by `elapsedMs`, newest at the bottom (older messages
// slide up and out of the top, as a chat scrolls).
function DemoChat({ elapsedMs }: { elapsedMs: number }) {
  const { t } = useTranslation();
  const domain = t('landing_example_domain_cafe');
  const isBetween = (from: number, to: number) => elapsedMs >= from && elapsedMs < to;

  return (
    <div className='flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden px-4 pt-4 text-[13px] leading-snug'>
      {elapsedMs >= _T.sent && <UserBubble>{t('landing_demo_user_msg', { name: _DEMO_USER.firstName })}</UserBubble>}
      {isBetween(_T.questionTyping, _T.question) && <TypingDots />}
      {elapsedMs >= _T.question && <AgentBubble>{t('landing_demo_agent_question', { name: _DEMO_USER.firstName })}</AgentBubble>}
      {isBetween(_T.questionOptions, _T.questionAnswer) && (
        <DemoOptions
          optionKeys={['landing_demo_option_no_deposit', 'landing_demo_option_deposit', 'landing_scene_option_unsure']}
          elapsedMs={elapsedMs}
          pointerAt={_T.questionPointer}
          pickedAt={_T.questionPicked}
        />
      )}
      {elapsedMs >= _T.questionAnswer && <UserBubble>{t('landing_demo_option_no_deposit')}</UserBubble>}
      {isBetween(_T.planTyping, _T.plan) && <TypingDots />}
      {elapsedMs >= _T.plan && (
        <AgentBubble>
          {t('landing_demo_agent_plan')}
          {/* The site plan, as the app shows a document in the chat. */}
          <span className='mt-2 flex items-center gap-2.5 rounded-xl border bg-card p-2.5'>
            <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground'>
              <FileTextIcon className='size-4' />
            </span>
            <span className='flex min-w-0 flex-1 flex-col'>
              <span className='text-xs font-semibold'>{t('landing_demo_plan_title')}</span>
              <span className='truncate text-[11px] text-muted-foreground'>{t('landing_demo_plan_pages')}</span>
            </span>
            <span className='rounded-md border px-2 py-0.5 text-[11px] font-semibold'>{t('landing_demo_open')}</span>
          </span>
        </AgentBubble>
      )}
      {isBetween(_T.buildOptions, _T.build) && (
        <DemoOptions optionKeys={['landing_demo_option_build', 'landing_demo_option_tweak']} elapsedMs={elapsedMs} pointerAt={_T.buildPointer} pickedAt={_T.buildPicked} />
      )}
      {elapsedMs >= _T.build && <UserBubble>{t('landing_demo_option_build')}</UserBubble>}
      {elapsedMs >= _T.building && <AgentBubble>{t('landing_demo_agent_building')}</AgentBubble>}
      {elapsedMs >= _T.tasks[0]! && <TaskList elapsedMs={elapsedMs} />}
      {isBetween(_T.live, _T.ready) && <TypingDots />}
      {elapsedMs >= _T.ready && <AgentBubble>{t('landing_demo_agent_ready', { domain })}</AgentBubble>}
      {isBetween(_T.liveOptions, _T.liveAnswer) && (
        <DemoOptions optionKeys={['landing_demo_option_golive', 'landing_demo_option_later']} elapsedMs={elapsedMs} pointerAt={_T.livePointer} pickedAt={_T.livePicked} />
      )}
      {elapsedMs >= _T.liveAnswer && <UserBubble>{t('landing_demo_option_golive')}</UserBubble>}
      {elapsedMs >= _T.liveMessage && <AgentBubble>{t('landing_demo_agent_live', { domain })}</AgentBubble>}
    </div>
  );
}

// The message box under the chat: Emma's first message types itself in, then gets sent.
function DemoComposer({ elapsedMs }: { elapsedMs: number }) {
  const { t } = useTranslation();
  const isTyping = elapsedMs >= _T.typeFrom && elapsedMs < _T.sent;
  const typedText = _typedPart(t('landing_demo_user_msg', { name: _DEMO_USER.firstName }), (elapsedMs - _T.typeFrom) / (_T.typeTo - _T.typeFrom));
  const isReadyToSend = isTyping && elapsedMs >= _T.typeTo;

  return (
    <div className='m-3 flex items-end gap-2 rounded-2xl border bg-card p-2.5 shadow-sm'>
      <p className={cn('line-clamp-2 min-h-9 flex-1 text-[13px] leading-snug', !isTyping && 'text-muted-foreground')}>
        {isTyping ? typedText : t('landing_demo_composer')}
        {isTyping && elapsedMs < _T.typeTo && <span className='ml-px inline-block h-3.5 w-px animate-pulse bg-foreground align-middle' />}
      </p>
      <span className={cn('grid size-7 shrink-0 place-items-center rounded-full transition-all duration-200', isReadyToSend ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
        <ArrowUpIcon className='size-4' />
      </span>
    </div>
  );
}

// The site being put together, before the real one fades in over it: a banner sweeping in, then tiles.
function BuildSketch({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div className='flex size-full flex-col gap-5 bg-card p-8'>
      <div className='flex items-center justify-between'>
        <div className='h-5 w-32 rounded-md bg-muted' />
        <div className='h-5 w-48 rounded-md bg-muted' />
      </div>
      <div className={cn('h-40 origin-left rounded-2xl bg-linear-to-r from-highlight to-chart-2 transition-all duration-700 ease-out', elapsedMs < _T.sketchBanner && 'scale-x-0 opacity-0')} />
      <div className='grid flex-1 grid-cols-3 gap-5'>
        {_T.sketchTiles.map(tileAt => (
          <div key={tileAt} className={cn('rounded-xl bg-muted transition-all duration-500 ease-out', elapsedMs < tileAt && 'scale-75 opacity-0')} />
        ))}
      </div>
    </div>
  );
}

// The preview beside the chat: it opens once the build starts, shows the site coming together, then the
// address types itself in, the padlock turns green and the "Live" tag pops up.
function DemoPreview({ elapsedMs }: { elapsedMs: number }) {
  const { t } = useTranslation();
  const domain = t('landing_example_domain_cafe');
  const isAddressShown = elapsedMs >= _T.domainFrom;
  const isLoading = elapsedMs >= _T.loading && elapsedMs < _T.published;
  const isPublished = elapsedMs >= _T.published;

  return (
    <div className='flex size-full flex-col bg-muted/50'>
      <div className='relative flex items-center gap-2 border-b bg-card px-3 py-2'>
        <BrowserDots />
        <span className='flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[11px] font-medium'>
          {isAddressShown
            ? (
                <>
                  <LockIcon className={cn('size-3 shrink-0 transition-colors duration-300', isPublished ? 'text-success' : 'text-muted-foreground/50')} />
                  <span className='truncate'>{_typedPart(domain, (elapsedMs - _T.domainFrom) / (_T.domainTo - _T.domainFrom))}</span>
                </>
              )
            : (
                <>
                  <EyeIcon className='size-3 shrink-0 text-muted-foreground' />
                  <span className='truncate text-muted-foreground'>{t('landing_demo_preview')}</span>
                </>
              )}
        </span>
        <span className={cn('absolute bottom-0 left-0 h-0.5 bg-brand-strong transition-[width] ease-out', isLoading ? 'w-full duration-500' : 'w-0 duration-0')} />
      </div>
      <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-3 sm:p-4'>
        <div className='relative w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-lg'>
          <ScaledFrame baseWidth={640} baseHeight={480}>
            <BuildSketch elapsedMs={elapsedMs} />
            <div className={cn('absolute inset-0 transition-opacity duration-700', elapsedMs >= _T.site ? 'opacity-100' : 'opacity-0')}>
              <CafeSite />
            </div>
          </ScaledFrame>
        </div>
        <span className={cn('flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success transition-all duration-500 ease-out', elapsedMs >= _T.liveTag ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}>
          <span className='relative flex size-1.5'>
            <span className='absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75' />
            <span className='relative size-1.5 rounded-full bg-success' />
          </span>
          {t('landing_scene_live')}
        </span>
      </div>
    </div>
  );
}

// The app's sidebar, as a signed-in user sees it, with the café project open (wide screens only).
function DemoSidebar() {
  const { t } = useTranslation();
  return (
    <div className='hidden w-52 shrink-0 flex-col gap-1 border-r bg-muted/40 p-3 text-[13px] lg:flex'>
      <div className='mb-2 flex items-center gap-2 px-1.5 py-1'>
        <img src={logo.src} alt='' width={24} height={24} loading='lazy' className='size-6' />
        <span className='font-heading font-bold'>Biveit</span>
      </div>
      <span className='mb-1 flex items-center gap-2 rounded-lg bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground'>
        <PlusIcon className='size-4' />
        {t('landing_demo_new_project')}
      </span>
      {[{ id: 'home', Icon: HouseIcon, labelKey: 'landing_demo_home' }, { id: 'search', Icon: SearchIcon, labelKey: 'landing_demo_search' }].map(item => (
        <span key={item.id} className='flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground'>
          <item.Icon className='size-4' />
          {t(item.labelKey)}
        </span>
      ))}
      <p className='mt-3 px-2.5 text-[11px] font-semibold text-muted-foreground'>{t('landing_demo_recents')}</p>
      <span className='rounded-lg bg-accent px-2.5 py-1.5 font-semibold text-accent-foreground'>{_DEMO_PROJECT}</span>
      {_RECENT_KEYS.map(recentKey => <span key={recentKey} className='truncate rounded-lg px-2.5 py-1.5 text-muted-foreground'>{t(recentKey)}</span>)}
      <div className='mt-auto flex items-center gap-2 px-1.5 pt-2'>
        <span className='grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>{_DEMO_USER.firstName[0]}</span>
        <span className='truncate font-medium'>{_DEMO_USER.fullName}</span>
      </div>
    </div>
  );
}

// The three steps as tabs over the demo: each lights up while the demo is at it (with a bar filling as it
// plays), and clicking one jumps the demo there. On wide screens each tab shows its explanation; on narrow
// ones only the current step's shows, under the tabs.
function StepTabs({ activeIndex, activeProgress, onPick }: { activeIndex: number; activeProgress: number; onPick: (index: number) => void }) {
  const { t } = useTranslation();

  return (
    <div>
      <ol className='grid grid-cols-3 gap-3 md:gap-6'>
        {_STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <Reveal as='li' key={step.id} delayMs={index * 150} data-stepid={step.id} className='min-w-0'>
              <button
                type='button'
                aria-pressed={isActive}
                onClick={() => onPick(index)}
                className={cn('flex w-full cursor-pointer flex-col gap-2 rounded-lg text-left transition-opacity duration-300 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none', !isActive && 'opacity-55 hover:opacity-80')}
              >
                <span className='h-1 overflow-hidden rounded-full bg-muted'>
                  <span
                    className='block h-full rounded-full bg-brand-strong transition-[width] duration-100 ease-linear'
                    style={{ width: `${isActive ? activeProgress * 100 : index < activeIndex ? 100 : 0}%` }}
                  />
                </span>
                <span className='flex items-baseline gap-2 font-heading'>
                  <span className='text-sm font-bold text-brand-strong'>{`0${index + 1}`}</span>
                  <span className='text-base font-bold tracking-[-0.02em] sm:text-xl'>{t(step.titleKey)}</span>
                </span>
                <span className='hidden text-sm leading-relaxed text-muted-foreground md:block'>{t(step.descKey)}</span>
              </button>
            </Reveal>
          );
        })}
      </ol>
      {/* All three stacked in one spot, only the current one showing, so the spot is always as tall as the
          longest and the page doesn't jump as the steps change. */}
      <div className='mt-3 grid text-sm leading-relaxed text-muted-foreground md:hidden'>
        {_STEPS.map((step, index) => (
          <p key={step.id} className={cn('col-start-1 row-start-1 transition-opacity duration-300', index !== activeIndex && 'invisible opacity-0')}>{t(step.descKey)}</p>
        ))}
      </div>
    </div>
  );
}

// Original purpose: the landing page's "how it works" (after the Profound reference the user picked).
// Intentions: one product demo that plays the three steps through, in the app's own look: Emma tells Biveit
// about her café and answers a couple of tap-to-answer questions, gets a site plan, watches it being built in
// the preview, and puts it online. The step tabs above follow along and let the visitor jump to a step.
// Drawn in code rather than shipped as a video: crisp at any size, in the page's language, and light.
// It only plays while on screen. With reduced motion it stands still on the finished step (the picked tab's).
export default function HowItWorks({ className }: { className?: string }) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [setDemoElement, isInView] = useIsInView<HTMLDivElement>();
  const [elapsedMs, setElapsedMs] = useState(0);
  // With reduced motion: which step's finished picture shows.
  const [stillStepIndex, setStillStepIndex] = useState(_STEPS.length - 1);
  useInterval(() => setElapsedMs(previous => (previous + _TICK_MS) % _T.total), isInView && !prefersReducedMotion ? _TICK_MS : null);

  const stillStep = _STEPS[stillStepIndex] ?? _STEPS[0]!;
  const shownMs = prefersReducedMotion ? stillStep.to - _FADE_OUT_MS - _TICK_MS : elapsedMs;
  const activeIndex = _.findLastIndex(_STEPS, step => shownMs >= step.from);
  const activeStep = _STEPS[activeIndex] ?? _STEPS[0]!;
  const activeProgress = prefersReducedMotion ? 1 : (shownMs - activeStep.from) / (activeStep.to - activeStep.from);
  const isFadingOut = shownMs >= _T.total - _FADE_OUT_MS;
  const isPreviewOpen = shownMs >= _T.previewOpen;

  const pickStep = (index: number) => {
    setStillStepIndex(index);
    setElapsedMs(_STEPS[index]?.from ?? 0);
  };

  return (
    <div className={className}>
      <StepTabs activeIndex={activeIndex} activeProgress={activeProgress} onPick={pickStep} />
      <Reveal className='mt-8'>
        <div
          ref={setDemoElement}
          aria-hidden='true'
          data-nosnippet=''
          data-demoms={shownMs}
          className='flex h-[34rem] overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10 sm:h-[36rem]'
        >
          <DemoSidebar />
          <div className={cn('flex min-w-0 flex-1 flex-col transition-opacity duration-500', isFadingOut && 'opacity-0')}>
            <div className='flex items-center gap-1.5 border-b px-4 py-2.5 text-sm font-semibold'>
              {_DEMO_PROJECT}
              <ChevronDownIcon className='size-3.5 text-muted-foreground' />
            </div>
            {/* Chat and preview: side by side on wide screens, stacked on phones. The preview grows in from
                nothing when the build starts. */}
            <div className='flex min-h-0 flex-1 flex-col md:flex-row'>
              <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
                <DemoChat elapsedMs={shownMs} />
                <DemoComposer elapsedMs={shownMs} />
              </div>
              <div
                className='min-h-0 min-w-0 overflow-hidden border-border transition-[flex-basis] duration-700 ease-out max-md:border-t md:border-l'
                style={{ flexBasis: isPreviewOpen ? '55%' : '0%', borderWidth: isPreviewOpen ? undefined : 0 }}
              >
                <DemoPreview elapsedMs={shownMs} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
