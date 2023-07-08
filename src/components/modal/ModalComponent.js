import React from "react";
import Modal from 'react-modal';
import { classNames } from "../../utils/ClassNames";
import Icon from "../icon/Icon";
export default function ModalComponent({ openModal = false, closeModal = {}, title, children, className }) {
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={closeModal}
      className={classNames('modal-base', className)}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className="modal-base-content">
        <div className="modal-base-header">
          <h2>{ title }</h2>
          <button className="btn-close box-content w-4 h-4 p-1 text-text border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-text hover:opacity-75 hover:no-underline" onClick={closeModal}><Icon.Close /></button>
        </div>

        <div className="modal-base-body">{children}</div>
      </div>
    </Modal>
  );
}

// <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabindex="-1" aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
//   <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
//     <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
//       <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
//         <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
//           Modal title
//         </h5>
//         <button type="button"
//           class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
//           data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body relative p-4">
//         <p>This is some placeholder content to show a vertically centered modal. We've added some extra copy here to show how vertically centering the modal works when combined with scrollable modals. We also use some repeated line breaks to quickly extend the height of the content, thereby triggering the scrolling. When content becomes longer than the predefined max-height of modal, content will be cropped and scrollable within the modal.</p>
//         <p>Just like that.</p>
//       </div>
//       <div
//         class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
//         <button type="button"
//           class="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
//           data-bs-dismiss="modal">
//           Close
//         </button>
//         <button type="button"
//           class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
//           Save changes
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
