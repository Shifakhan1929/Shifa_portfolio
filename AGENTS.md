<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep desktop standby reactions in a dedicated client component, using global semantic mood tokens; this isolates idle timers and presentation from window management.
- Closing the last desktop portfolio tab closes its window; a fresh portfolio mount restores all tabs when reopened.
- Pocket shows the shared standby component after returning home from an app, while retaining its initial home screen; mobile uses normal-flow positioning so all actions stay reachable.
- Standby timers count pointer, keyboard, focus, and scroll activity, wake idle reactions on return, and pause while the document is hidden.
- LeetCode activity uses a client-only public API refresh with validated response normalization; preserve supplied fallback stats and label illustrative calendars honestly when live history is unavailable.
