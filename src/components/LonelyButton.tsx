import { useState } from 'react';

interface LonelyButtonProps {
  projectCount: number;
  onAccelerate: () => void;
}

export default function LonelyButton({ projectCount, onAccelerate }: LonelyButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    onAccelerate();
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
    }, 8000);
  };

  const saturnImgUrl = '/images/saturn.jpg';

  return (
    <>
      <button
        className="lonely-btn"
        onClick={handleClick}
        title="我太孤独了"
      >
        我太孤独了
      </button>

      {showModal && (
        <div className="lonely-modal">
          <div className="modal-content planet-modal">
            <div className="saturn-scene">
              <div className="saturn-img-wrapper">
                <img
                  src={saturnImgUrl}
                  alt="土星"
                  className="saturn-img"
                />
              </div>
            </div>
            <div className="planet-text-group">
              <p className="planet-main-text">
                你不是一个人
              </p>
              <p className="planet-highlight-text">
                今天有 <span className="num">{projectCount}</span> 位开发者与你同在
              </p>
              <p className="planet-sub-text">
                保持热爱 ✦ 奔赴山海
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
