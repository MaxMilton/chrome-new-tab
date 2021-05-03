/* eslint-disable @typescript-eslint/unbound-method */
// FIXME: Calculate if the folder will be outside the viewport and render in a better place

// FIXME: Hide subfolder imidiately if another is openned to prevent overlap

// FIXME: Continue to show subfolder when moving mouse back onto parent

// FIXME: max-height (for scroll) needs to be dynamic depending on where the folder opens from

import { append, create } from '../utils';
import { Link, LinkComponent, LinkProps } from './Link';

type SubFolderComponent = HTMLDivElement;

interface SubFolderProps {
  children: chrome.bookmarks.BookmarkTreeNode[];
  level: number;
  parent: Element;
}

type SubFolderScope = {
  clearTimer(): void;
  resetTimer(): void;
};

const CLOSE_DELAY_MS = 400;
// @ts-expect-error - FIXME: Use this var or remove it
let openFolders = 0;

const subFolderView = create('div');
subFolderView.className = 'subfolder';

function SubFolder(
  { children, level, parent }: SubFolderProps,
  scope: SubFolderScope,
): SubFolderComponent {
  const root = subFolderView.cloneNode(true) as SubFolderComponent;

  const parentPos = parent.getBoundingClientRect();

  if (level > 0) {
    // nested subfolders show beside their parent
    root.style.top = `${parentPos.top}px`;
    root.style.left = `${parentPos.right}px`;
  } else {
    // top level subfolders show bellow their parent
    // root.style.top = parentPos.bottom + 'px';
    // root.style.left = parentPos.left + 'px';

    root.style.top = `${parentPos.bottom}px`;

    // show from the right if folder would overflow right
    // FIXME: instead of 200 get the folder width
    if (parentPos.left + 200 > window.innerWidth) {
      // FIXME:
      // root.style.right = parentPos.right + 'px';
      root.style.right = '0px';
    } else {
      root.style.left = `${parentPos.left}px`;
    }
  }

  children.forEach((item) => {
    // @ts-expect-error - FIXME
    // eslint-disable-next-line no-param-reassign
    item.level = level + 1;
    append(BookmarkNode(item), root);
  });

  root.onmouseenter = scope.clearTimer;
  root.onmouseleave = scope.resetTimer;

  return root;
}

type FolderComponent = HTMLDivElement;

interface FolderProps extends chrome.bookmarks.BookmarkTreeNode {
  children?: chrome.bookmarks.BookmarkTreeNode[];
  end?: boolean;
  level?: number;
}

const folderView = create('div');
folderView.className = 'item';

export function Folder(item: FolderProps): FolderComponent {
  const root = folderView.cloneNode(true) as FolderComponent;

  // TODO: Keep? Implement "Other Bookmarks"
  if (item.end) root.className += ' right';
  root.textContent = item.title;

  let subfolder: Element | null;
  let timer: NodeJS.Timeout;

  const scope = {
    clearTimer() {
      if (timer) clearTimeout(timer);
    },
    resetTimer() {
      scope.clearTimer();

      timer = setTimeout(() => {
        if (subfolder) {
          subfolder.remove();
          subfolder = null;

          if (!item.level || item.level === 0) {
            openFolders -= 1;
          }
        }
      }, CLOSE_DELAY_MS);
    },
  };

  root.onmouseenter = () => {
    scope.clearTimer();

    // TODO: Remove `item.children` here and instead of doing nothing show an "empty" folder
    if (!subfolder && item.children) {
      subfolder = SubFolder(
        {
          children: item.children,
          level: item.level || 0,
          parent: root,
        },
        scope,
      );
      append(subfolder, root);
    }
  };

  root.onmouseleave = scope.resetTimer;

  return root;
}

export function BookmarkNode(
  item: FolderProps | LinkProps,
): FolderComponent | LinkComponent {
  // @ts-expect-error - FIXME
  return (item.children ? Folder : Link)(item);
}
